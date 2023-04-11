import React, { useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import dp from "../../Assets/dp1.png";
// "src/Assets/dp1.svg"
import "./styles.css";
import { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
  where,
  getDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import SendMessage from "../Cells/SendMessage";
import SignOut from "../Atoms/SignOut";
import { messageContext } from "../../App";
import { getAuth, updateCurrentUser } from "firebase/auth";
import SideBar from "../SideBar";
import { useParams } from "react-router-dom";
import { IMAGES } from "../Utillities/Images";
import { RANDOM_TEXT } from "../../ConstantString";
import { edit, threeDotsHamburger } from "../Utillities/icons";
import SelectParticipants from "../Cells/SelectParticipants";
import CustomModal from "../CustomComponents/CustomModal";
import Header from "../Atoms/Header";
import { GrpParticipantContext } from "../../Context/GrpParticipantContextDefination";

function LiveChat() {
  const {
    setErrorMessage,
    recieverDetails,
    setRecieverDetails,
    welcomeChatPage,
    setWelcomeChatPage,
    activeUser,
    actualDbId,
    setActualDbId,
    messages,
    setMessages,
    users,
    setUsers,
  } = useContext(messageContext);
  let dbId;
  const [showMemberEditFormOnTheRight, setShowMemberEditFormOnTheRight] =
    useState(false);
  const [selectedParticipantsChat, setSelectedParticipantsChat] = useState(
    recieverDetails?.participants
  );
  const [isEditGrpBtnClicked, setIsEditGrpBtnClicked] = useState(false);
  const [groupName, setGroupName] = useState("");
  // const [groupName,setGroupName] = useState(recieverDetails?.groupName);
  const param = useParams();
  let groupNameTemp = recieverDetails?.groupName;
  
  const presentUser = (users?.find(user=>user.uid === auth.currentUser.uid));
  setErrorMessage("");

  // useEffect(() => {
  //   const q = query(collection(db, "users"), orderBy("createdAt"));
  //   const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
  //     let users = [];
  //     console.log("<>snapshot<>", QuerySnapshot);

  //     QuerySnapshot.forEach((doc) => {
  //       console.log("<>snapshot foreach<>", doc, doc.id, typeof doc);
  //       users.push({ ...doc.data() });
  //       console.log("messages<>: ", users);
  //     });
  //     setUsers(users);
  //   });
  //   console.log("actualDbId in useEffectMount(sidebar) :", actualDbId);
  //   return () => unsubscribe;
  // }, []);

  useEffect(() => {
    // console.log("actualDbId: effect,reciever", );
    if (recieverDetails?.groupName) {
      setActualDbId(recieverDetails?.uid);
      setGroupName(recieverDetails?.name);
      groupNameTemp = recieverDetails?.groupName;
      setSelectedParticipantsChat(recieverDetails?.participants);
      // setShowMemberEditFormOnTheRight()
    } else {
      dbId =
        recieverDetails.uid > activeUser?.uid
          ? recieverDetails.uid + activeUser?.uid
          : activeUser?.uid + recieverDetails.uid;
      setActualDbId(dbId);
    }
  }, [recieverDetails?.uid]);

  useEffect(() => {
    console.log("useEffect(Send Message) actualDbId changed ", actualDbId);
    // console.log("dbId new",dbId)

    if (actualDbId?.length > 35) {
      const setDocAsync = async () => {
        const docRef = await getDoc(doc(db, "chats", actualDbId));
        console.log("doesn't exist", actualDbId, docRef.exists());
        if (docRef.exists() || !actualDbId) return null;
        console.log("doesn't exist");
        await setDoc(doc(db, "chats", actualDbId), {
          uid: actualDbId,
          senderUid: activeUser?.uid,
          senderName: activeUser?.name,
          recieverUid: recieverDetails.uid,
          recieverName: recieverDetails.name,
          senderDetails: activeUser,
          recieverDetails,
          createdAt: serverTimestamp(),
          messages: [],
        });
      };

      actualDbId && Object.keys(recieverDetails).length && setDocAsync();

      console.log("actualDbId: effect", actualDbId, recieverDetails);
      const messageList = [];
      Object.keys(recieverDetails).length && setWelcomeChatPage(false);

      console.log(
        "actualDbId in useEffect(LiveCHat) b4:",
        recieverDetails,
        actualDbId
      );
    }
    Object.keys(recieverDetails)?.length && setWelcomeChatPage(false);
    console.log(actualDbId, "actualDbId after grp made");
    const unsubscribe = onSnapshot(
      doc(db, "chats", actualDbId || RANDOM_TEXT),
      (doc) => {
        // doc?.exists() && setMessages(doc.data()?.messages);
        setMessages(doc.data()?.messages);
        console.log("doc on snapshot data :", doc.data()?.messages, actualDbId);
        console.log("actualDbId in useEffect(LiveCHat) :", actualDbId);
        //setWelcomeChatPage(true);
      }
    );
    console.log("recieverDetails ", recieverDetails);
    return () => unsubscribe();
  }, [actualDbId]);

  const checkIfPresentUserIsAdmin = ()=> presentUser?.uid?.includes(auth.currentUser.uid);

  return (
    //RecieveChat
    <div className="liveChat">
      {/* {showMemberEditFormOnTheRight && <CustomModal { children, show, setEditedGroupName = ()=>{}, string, handleEditGroupName, editedGroupName, handleGroupNameEdit, setShow, channelName, title, selectedList, setSelectedList, addChannel, addUser=()=>{}, handleSelect=()=>{}, showHead, showFoot }) >
      </CustomModal>} */}
      {/* <SignOut /> */}
      {console.log("recieverDetails in <><><><>", recieverDetails)}
      {/* {!auth.currentUser.uid && console.log("null chak")} */}
      <div className="d-flex justify-content-start sidebar">
        <SideBar />
        <div className="w-100 pt-3 ">
          {welcomeChatPage ? (
            <div className="align-middle w-100 h-50">
              {" "}
              Select a contact to chat
            </div>
          ) : (
            <>
              <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <img
                  className="avatar"
                  src={recieverDetails?.avatar}
                  alt="Avatar"
                />
                {"  "}{console.log("users:<><><<>",users)} 
                <div style={{ width: "95%" }}>
                  <p>{(users?.find(user=>user.uid === actualDbId))?.groupName || recieverDetails?.name}</p>
                </div>
                {console.log("presentUser? : ",actualDbId?.length > (auth.currentUser.uid).length)}
                
                {recieverDetails?.participants?.length && <p className="text-primary blockquote-footer overflow-hidden" style={{}}>
                  {recieverDetails?.groupName &&
                    (users?.find(user=>user.uid === actualDbId))?.participants?.map(
                      (member) => {
                        if(member?.uid !== member?.creator)
                          return `${member.name},`
                          }//(users?.find(user=>user.uid === actualDbId))
                    )}
                </p>}
                {recieverDetails?.groupName && actualDbId?.includes(auth.currentUser.uid) && actualDbId?.length > (auth.currentUser.uid).length && <>
                <button
                  style={{ border: "none" }}
                  onClick={() => {
                    //MODAL SELECTPARTS
                    if (recieverDetails?.groupName)
                      setShowMemberEditFormOnTheRight(true);
                    console.log("dfs");
                  }}
                >
                  {edit}
                </button>
                </>}
                {/* <button>+</button> */}
              </nav>
              <div
                className="scroll-right"
                style={{ background: "beige", height: "68%" }}
              >
                <ul>
                  {messages?.map((message) => {
                    console.log("message:::", message);
                    const cssStr =
                      message.uid === auth.currentUser.uid
                        ? "-sender"
                        : "-reciever";
                    console.log("cssStr: ", cssStr);
                    if (!(message.text || message.img || message.pdf))
                      return null;
                    return (
                      <div className={`container${cssStr}`}>
                        {recieverDetails?.groupName && <p className="text-info blockquote-footer">
                          {recieverDetails?.groupName && message.name}
                        </p>}
                        <p>{message.text}</p>
                        {message?.img && <img src={message.img}></img>}
                        {message?.pdf && console.log(message.pdf?.name)}
                        <span className="time-right">{message?.time}</span>
                      </div>
                    );
                  })}
                </ul>
              </div>
              <SendMessage />
            </>
          )}
        </div>
        {showMemberEditFormOnTheRight && (
          <div className="selectParticipants-right">
            <Header
              title="Edit Group"
              goBack={() => setShowMemberEditFormOnTheRight(false)}
            />
            <br />
            {console.log(groupName, "groupName<><><>><<><><><><>><><")}
            <SelectParticipants
              users={users}
              selectedParticipants={selectedParticipantsChat}
              setSelectedParticipants={setSelectedParticipantsChat}
              isNewGroup={false}
              isNewGroupBtnClicked={isEditGrpBtnClicked}
              setIsNewGroupBtnClicked={setIsEditGrpBtnClicked}
              showGroupAddComp={showMemberEditFormOnTheRight}
              setShowGroupAddComp={setShowMemberEditFormOnTheRight}
              groupName={groupName}
              setGroupName={setGroupName}
            />
          </div>
        )}
      </div>
      {/* welcomeChatPage */}
    </div>
  );
}

export default LiveChat;

{
  /* <img
        src={IMAGES.default}
        alt="Avatar"
        style={{ width: "100%" }}
      /> */
}

// const [user] = useAuthState(auth);
// console.log("user<><><><.", user, param)
// const docRef = collection(db, "messages");
// param = activeUser?.name

////////get unique db id
// console.log(
//   "auth.currentUser :",
//   auth.currentUser.uid,
//   auth.currentUser,
//   senderDetails
// );
// console.log("uid2 name ", user);

// const existingContact12 = await getDoc(
//   doc(db, "chats", `${recieverUid + senderUid}`)
// );
// const existingContact21 = await getDoc(
//   doc(db, "chats", `${senderUid + recieverUid}`)
// );
// //
// console.log("actualDbId:", actualDbId);

// // else setActualDbId(recieverUid + senderUid);
// // const dbExists = ;
// // !dbExists &&

// if (!(existingContact12.exists() || existingContact21.exists()))
//   setActualDbId(recieverUid + senderUid);
// console.log("actualDbId: i", actualDbId);
// // setActualDbId();
// console.log("contact exists", actualDbId);

// if (!actualDbId) {
//   if (existingContact21.exists()) setActualDbId(senderUid + recieverUid);
//   else setActualDbId(recieverUid + senderUid);
// }
