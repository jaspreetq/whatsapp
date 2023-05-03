import React, { createContext, useContext } from "react";
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
import { getUserFromUid } from "../../Components/Utillities/getUserFromUid";
import UserProfile from "../../Components/Cells/UserProfile";
import Header from "../../Components/Atoms/Header";
import SelectParticipants from "../../Components/Cells/SelectParticipants";
import { edit, filePdf } from "../../Components/Utillities/icons";
import SideBar from "../../Components/SideBar";
import { messageContext } from "../../App";
import { useParams } from "react-router-dom";
import { RANDOM_TEXT } from "../../ConstantString";
import SendMessage from "../../Components/Cells/SendMessage";
import { IMAGES } from "../../Components/Utillities/Images";
import Loader from "../../Components/Atoms/Loader";

export const FileContext = createContext();

function LiveChat() {
  const [outputMessage, setOutputMessage] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [imgName, setImgName] = useState("");
  const [pdf, setPdf] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileStatus, setFileStatus] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState();

  const [showGroupInfoEditForm, setShowGroupInfoEditForm] = useState(false);
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
    setSelectedParticipants
  } = useContext(messageContext);
  let dbId;
  const isAdmin = () => actualDbId?.includes(auth.currentUser.uid);
  const [showMemberEditFormOnTheRight, setShowMemberEditFormOnTheRight] =
    useState(false);
  const [selectedParticipantsChat, setSelectedParticipantsChat] = useState(
    recieverDetails?.participants
  );
  const [isEditGrpBtnClicked, setIsEditGrpBtnClicked] = useState(false);
  const [groupName, setGroupName] = useState("");
  const refHook = useRef();
  // const [groupName,setGroupName] = useState(recieverDetails?.groupName);
  const param = useParams();
  let groupNameTemp = recieverDetails?.groupName;

  const presentUser = users?.find((user) => user.uid === auth.currentUser.uid);


  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "users", recieverDetails?.uid || actualDbId || RANDOM_TEXT),
      (doc) => {
        // doc?.exists() && setMessages(doc.data()?.messages);
        if (doc?.exists()) {
          const { avatar, name, uid, groupName, participants } = doc.data();
          if (name)
            setRecieverDetails({
              ...recieverDetails,
              ["avatar"]: avatar,
              ["name"]: name,
              ["uid"]: uid
            });
          else
            setRecieverDetails({
              ...recieverDetails,
              ["avatar"]: avatar,
              ["groupName"]: groupName,
              ["participants"]: participants,
              ["uid"]: uid
            });
        }

        // console.log("doc on snapshot data :", doc.data()?.messages, actualDbId);
        // console.log("actualDbId in useEffect(LiveCHat) :", actualDbId);
        //setWelcomeChatPage(true);
      }
    );
    // console.log("recieverDetails outside changed visible? ", recieverDetails);
    return () => unsubscribe();
  }, [users]);
    // recieverDetails?.name,
    // recieverDetails?.groupName,
    // recieverDetails?.avatar,
    // recieverDetails?.participants,
    
  // console.log("recieverDetails changed visible? ", recieverDetails);
  // useEffect(() => {
  // }, [recieverDetails?.uid]);

  // useEffect(()=>{

  // },[])
  useEffect(() => {
    refHook.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    // console.log("actualDbId: effect,reciever", );
    setFileStatus(false);
    setShowGroupInfoEditForm(false);
    // console.log("recieverDetails: in livechat", recieverDetails)
    if (recieverDetails?.groupName) {
      setActualDbId(recieverDetails?.uid);
      setGroupName(recieverDetails?.name);
      groupNameTemp = recieverDetails?.groupName;
      setSelectedParticipantsChat([...recieverDetails?.participants]);
      // setShowMemberEditFormOnTheRight()
      setWelcomeChatPage(false)
    } else {
      dbId =
        recieverDetails?.uid > activeUser?.uid
          ? recieverDetails?.uid + activeUser?.uid
          : activeUser?.uid + recieverDetails?.uid;
      setActualDbId(dbId);
    }
  }, [recieverDetails?.uid]);

  useEffect(() => {
    // console.log("useEffect(Send Message) actualDbId changed ", actualDbId);
    // console.log("dbId new",dbId)

    if (actualDbId?.length > 35) {
      const setDocAsync = async () => {
        const docRef = await getDoc(doc(db, "chats", actualDbId));
        // console.log("doesn't exist", actualDbId, docRef.exists());
        if (docRef.exists() || !actualDbId) return null;
        // console.log("doesn't exist");
        await setDoc(doc(db, "chats", actualDbId), {
          uid: actualDbId,
          senderUid: activeUser?.uid,
          senderName: activeUser?.name,
          recieverUid: recieverDetails?.uid,
          recieverName: recieverDetails?.name,
          senderDetails: activeUser,
          recieverDetails,
          createdAt: serverTimestamp(),
          messages: [],
          lastChatedAt: serverTimestamp(),
        });
      };

      actualDbId && Object.keys(recieverDetails).length && setDocAsync();

      // console.log("actualDbId: effect", actualDbId, recieverDetails);
      const messageList = [];
      Object.keys(recieverDetails).length && setWelcomeChatPage(false);

      // console.log(
      //   "actualDbId in useEffect(LiveCHat) b4:",
      //   recieverDetails,
      //   actualDbId
      // );
    }
    Object.keys(recieverDetails)?.length && setWelcomeChatPage(false);
    // console.log(actualDbId, "actualDbId after grp made");
    const unsubscribe = onSnapshot(
      doc(db, "chats", actualDbId || RANDOM_TEXT),
      (doc) => {
        // doc?.exists() && setMessages(doc.data()?.messages);
        setMessages(doc.data()?.messages);
        // console.log("doc on snapshot data :", doc.data()?.messages, actualDbId);
        // console.log("actualDbId in useEffect(LiveCHat) :", actualDbId);
        //setWelcomeChatPage(true);
      }
    );
    setErrorMessage("");
    // console.log("recieverDetails ", recieverDetails);
    return () => unsubscribe();
  }, [actualDbId]);

  const defaultRec = () => users?.find((user) => user.uid !== auth.currentUser?.uid);

  const getCurrentUser = () => users?.find((user) => {
    return user.uid == auth.currentUser.uid;
  })

  const checkIfPresentUserIsAdmin = () =>
    presentUser?.uid?.includes(auth.currentUser.uid);

  return (
    //RecieveChat
    <div className="liveChat">
      <div className="registerHeader seeThrough"></div>
      {/* {showMemberEditFormOnTheRight && <CustomModal { children, show, setEditedGroupName = ()=>{}, string, handleEditGroupName, editedGroupName, handleGroupNameEdit, setShow, channelName, title, selectedList, setSelectedList, addChannel, addUser=()=>{}, handleSelect=()=>{}, showHead, showFoot }) >
      </CustomModal>} */}
      {/* <SignOut /> */}
      {/* {console.log("recieverDetails in <><><><>", recieverDetails)} */}
      {/* {!auth.currentUser.uid && console.log("null chak")} */}
      <div className="d-flex justify-content-start sidebar">
        <SideBar />
        <div style={{ width: "80%" }}>
          {welcomeChatPage ? (
            <div className="defaultChat align-middle w-100 h-100">
              {" "}
              <div style={{ "font-size": "23px", "padding-left": "10px", "background": "#f8f9fae0" }}><br />Select a contact to chat</div>
            </div>
          ) : (
            <>
              <nav className="navbar navbar-expand-lg navbar-light bg-light border-left">
                <img
                  className="avatar"
                  src={getUserFromUid(recieverDetails?.uid, users)?.avatar || IMAGES.default}
                  alt="Avatar"
                  key="unique2"
                  id="unique2"
                  onClick={() => {
                    setShowMemberEditFormOnTheRight(false)
                    setShowGroupInfoEditForm(true)
                  }}
                />

                {/* {recieverDetails?.groupName && actualDbId?.length > (auth.currentUser.uid).length && <>
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
                </>} */}

                {"  "}
                {/* {console.log("users:<><><<>", users)} */}
                <div style={{ width: "95%" }}>
                  <p>
                    {users?.find((user) => user.uid === actualDbId)
                      ?.groupName || recieverDetails?.name}
                  </p>
                </div>
                {/* {console.log(
                  "presentUser? : ",
                  actualDbId?.length > auth.currentUser.uid.length
                )} */}

                {recieverDetails?.participants?.length && (
                  <p
                    className="text-primary blockquote-footer overflow-hidden"
                  >
                    {recieverDetails?.groupName &&
                      users
                        ?.find((user) => user.uid === actualDbId)
                        ?.participants?.map(
                          (member) => {
                            if (member?.uid === auth.currentUser.uid) return `${getCurrentUser()?.name}, `
                            return `${getUserFromUid(member?.uid, users)?.name}, `;
                          } //(users?.find(user=>user.uid === actualDbId))
                        )}
                  </p>
                )}
                {recieverDetails?.groupName &&
                  isAdmin() &&
                  actualDbId?.length > auth.currentUser.uid.length && (
                    <>
                      <button
                        style={{ border: "none" }}
                        onClick={() => {
                          //MODAL SELECTPARTS
                          if (recieverDetails?.groupName)
                            {
                              setShowGroupInfoEditForm(false)
                              setShowMemberEditFormOnTheRight(true);
                            }
                          // console.log("dfs");
                        }}
                      >
                        {edit}
                      </button>
                    </>
                  )}
                {/* <button>+</button> */}
              </nav>

              {fileStatus ? (
                <>
                  <Header title="" goBack={() => setFileStatus(false)} />
                  <div style={{ background: "#bfc7cc00", height: "68%" }}>
                    {img && (
                      <div className="uploadedImage">
                        <label className="center" style={{ display: "block" }}>
                          {imgName}
                        </label>
                        <img
                          className="uploadImg"
                          src={URL.createObjectURL(img)}
                          width="50%"
                          height="80%"
                        />
                      </div>
                    )}

                    {pdf && (
                      <div className="uploadedImage">
                        <object
                          data={URL.createObjectURL(pdf)}
                          width="30%"
                          height="75%"
                        ></object>
                        <label>{pdfName}</label>
                      </div>
                    )}

                    {/* {message?.img && <img src={message?.img} alt="img" height="100px" width="100px" />} */}
                  </div>
                </>
              ) : (
                <div
                  className="scroll-right"
                  style={{ background: "#e4ddd5", height: "68%", width: "100%" }}
                >
                  <ul>
                    {messages?.map((message, idx) => {
                      {/* console.log("message:::", message); */}
                      const cssStr =
                        message.uid === auth.currentUser.uid
                          ? "-sender"
                          : "-reciever";
                      {/* console.log("cssStr: ", cssStr); */}
                      if (!(message.text || message.img || message.pdf))
                        return null;
                      return (
                        <div className="w-100">
                          <div ref={refHook} className={`container${cssStr} shadow`}>
                            {/* {message?.img && <img src={message?.img} height="100px" width="100px"/>} */}
                            {recieverDetails?.groupName && (
                              <span>
                                {recieverDetails?.groupName && (cssStr === "-reciever") && (
                                  <img
                                    style={{ display: "inline" }}
                                    className="avatar"
                                    src={getUserFromUid(message?.uid, users)?.avatar}
                                  />
                                )}
                                {cssStr === "-reciever" && <p
                                  className="ml-75 text-info blockquote-footer"
                                  style={{ display: "inline" }}
                                >
                                  {recieverDetails?.groupName && getUserFromUid(message?.uid, users)?.name}
                                </p>}
                              </span>
                            )}
                            <p>{message.text}</p>
                            {/* {console.log(message?.img, "message?.img::::::")} */}
                            {message?.img && (
                              <a target="blank" href={message?.img} download>
                                <img
                                  src={message?.img}
                                  alt="img"
                                  height="100px"
                                  width="100px"
                                // onClick={()=>set}
                                />
                              </a>
                            )}
                            {/* {message?.pdf && console.log(message.pdf?.name)} */}
                            {message?.pdf && (
                              <a target="blank" href={message?.pdf} download>
                                {filePdf}
                                {`\n${message?.fileName}`}
                              </a>
                            )}
                            <span className="time-right">{message?.time}</span>
                          </div>
                          {/* <span className=`time${}`>{message?.time}</span> */}
                          {loading && messages.length - 1 === idx && <Loader />}
                        </div>
                      );
                    })}
                  </ul>
                </div>
              )}
              <FileContext.Provider
                value={{
                  outputMessage,
                  setOutputMessage,
                  text,
                  setText,
                  img,
                  setImg,
                  imgName,
                  setImgName,
                  pdf,
                  setPdf,
                  pdfName,
                  setPdfName,
                  loading,
                  setLoading,
                  fileStatus,
                  setFileStatus,
                  invalid,
                  setInvalid,
                  imgUrl,
                  setImgUrl,
                  pdfUrl,
                  setPdfUrl,
                  fileUrl,
                  setFileUrl,
                }}
              >
                {loading && !fileStatus && <Loader />}
                <SendMessage />
                {/* <UserProfile activeUser={activeUser}/> */}
              </FileContext.Provider>
            </>
          )}
        </div>
        {showGroupInfoEditForm && recieverDetails?.groupName && (
          <div className="d-block">
            {/* <div className="lds-ellipsis" style={{"font-size":"5rem"}}>
          <div>.</div><div>.</div><div>.</div><div>.</div>
          </div> */}
            {/* {console.log(recieverDetails, "groupName<><><>><<><><><><>><><")} */}
            <Header
              title="Group Info"
              goBack={() => setShowGroupInfoEditForm(false)}
            />
            <br /><br />
            <UserProfile
              activeUser={recieverDetails}
              setEditProfile={setShowGroupInfoEditForm}
              isGroup={true}
            />
          </div>
        )}
        {showMemberEditFormOnTheRight && (
          <div className="selectParticipants-right">
            <Header
              title="Edit Group"
              goBack={() => setShowMemberEditFormOnTheRight(false)}
            />
            <br />
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
