import React, {createContext, useContext} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../firebase";
import dp from "../../Assets/dp1.png";
// "src/Assets/dp1.svg"
import "./styles.css";
import {useEffect, useRef, useState} from "react";
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
  updateDoc,
} from "firebase/firestore";
import {getUserFromUid} from "../../Components/Utillities/getUserFromUid";
import UserProfile from "../../Components/Cells/UserProfile";
import Header from "../../Components/Atoms/Header";
import SelectParticipants from "./components/SelectParticipants";
import {edit, filePdf} from "../../Components/Utillities/icons";
import SideBar from "../../Components/SideBar";
import {messageContext} from "../../App";
import {useParams} from "react-router-dom";
import {RANDOM_TEXT} from "../../ConstantString";
import SendMessage from "../../Components/Cells/SendMessage";
import {IMAGES} from "../../Components/Utillities/Images";
import Loader from "../../Components/Atoms/Loader";
import getActiveUserId from "../../Components/Utillities/getActiveUserId";
import {async} from "react-input-emoji";
// import getActiveUser from "../../Components/Utillities/getActiveUserId";

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
    unseenCounter,
    setUnseenCounter,
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
    setSelectedParticipants,
    chats,
    lastMessage,
    setLastMessage,
    message,
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
          const {
            avatar,
            name = "",
            uid,
            groupName = "",
            participants,
          } = doc.data();
          if (name)
            setRecieverDetails({
              ...recieverDetails,
              ["avatar"]: avatar,
              ["name"]: name,
              ["uid"]: uid,
            });
          else
            setRecieverDetails({
              ...recieverDetails,
              ["avatar"]: avatar,
              ["groupName"]: groupName,
              ["participants"]: participants,
              ["uid"]: uid,
            });
        }
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    refHook.current?.scrollIntoView();
  }, [messages, loading]);

  useEffect(() => {
    if (recieverDetails?.groupName) {
    }
    if (recieverDetails?.name) {
      const thisChat = chats?.find((chat) => chat.uid === actualDbId);
      const lastText = thisChat?.messages?.at(-1)?.text;
      setLastMessage(lastText);
      let unseenMessageCountLocal, lastChatLocal;
      const unsubscribe = onSnapshot(
        doc(db, "users", activeUser?.uid || RANDOM_TEXT),
        (doc) => {
          if (doc?.exists()) {
            const {
              avatar,
              name = "",
              uid,
              unseenMessageCount,
              lastChat,
              groupName = "",
              participants,
            } = doc.data();
            setUnseenCounter({...unseenMessageCount});
          }
        }
      );

      return () => unsubscribe();
    }
  }, [chats]);
  useEffect(() => {
    if (
      recieverDetails?.groupName &&
      recieverDetails?.unseenMessageCount[getActiveUserId()] > 0
    ) {
      const asyncCountUpdate = async () =>
        await updateDoc(doc(db, "users", recieverDetails?.uid), {
          uid: recieverDetails?.uid,
          groupName: recieverDetails?.groupName,
          participants: [...recieverDetails?.participants],
          avatar: recieverDetails?.avatar, //random array dp generator
          createdAt: recieverDetails?.createdAt,
          creatorUid: recieverDetails?.creatorUid,
          lastChat: recieverDetails?.lastChat,
          unseenMessageCount: {
            ...getUserFromUid(recieverDetails?.uid, users)?.unseenMessageCount,
            ...{[getActiveUserId()]: 0},
          },
        });
      recieverDetails?.groupName && asyncCountUpdate();
    }

    setFileStatus(false);
    setShowGroupInfoEditForm(false);

    if (recieverDetails?.groupName) {
      setActualDbId(recieverDetails?.uid);
      setGroupName(recieverDetails?.name);
      groupNameTemp = recieverDetails?.groupName;
      setSelectedParticipantsChat([...recieverDetails?.participants]);
      setWelcomeChatPage(false);
    } else {
      dbId =
        recieverDetails?.uid > activeUser?.uid
          ? recieverDetails?.uid + activeUser?.uid
          : activeUser?.uid + recieverDetails?.uid;
      setActualDbId(dbId);
    }
  }, [recieverDetails?.uid]);

  useEffect(() => {
    if (
      actualDbId.length > 0 &&
      recieverDetails?.name &&
      activeUser?.unseenMessageCount[actualDbId] > 0
    ) {
      const updateCntTo0 = async () =>
        await updateDoc(doc(db, "users", activeUser?.uid), {
          uid: activeUser.uid,
          name: activeUser.name,
          email: activeUser.email,
          avatar: activeUser.avatar, //random array dp generator
          createdAt: activeUser.createdAt,
          lastChat: activeUser?.lastChat,
          unseenMessageCount: {
            ...activeUser?.unseenMessageCount,
            ...{[actualDbId]: 0},
          },
        });
      updateCntTo0();
    }
    if (actualDbId?.length > 35) {
      const setDocAsync = async () => {
        const docRef = await getDoc(doc(db, "chats", actualDbId));
        if (docRef.exists() || !actualDbId) return null;
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

      const messageList = [];
      Object.keys(recieverDetails).length && setWelcomeChatPage(false);
    }
    Object.keys(recieverDetails)?.length && setWelcomeChatPage(false);
    const unsubscribe = onSnapshot(
      doc(db, "chats", actualDbId || RANDOM_TEXT),
      (doc) => {
        setMessages(doc.data()?.messages);
      }
    );
    setErrorMessage("");
    return () => unsubscribe();
  }, [actualDbId]);

  const defaultRec = () =>
    users?.find((user) => user.uid !== auth.currentUser?.uid);

  const getCurrentUser = () =>
    users?.find((user) => {
      return user.uid == auth.currentUser.uid;
    });

  const checkIfPresentUserIsAdmin = () =>
    presentUser?.uid?.includes(auth.currentUser.uid);

  return (
    //RecieveChat
    <div className="liveChat">
      <div className="registerHeader seeThrough"></div>
      <div className="d-flex justify-content-start sidebar shadowBorder">
        <SideBar />
        <div style={{width: "80%"}}>
          {welcomeChatPage ? (
            <div className="defaultChat align-middle w-100 h-100">
              {" "}
              <div
                style={{
                  "font-size": "23px",
                  "padding-left": "10px",
                  background: "#f8f9fae0",
                }}
              >
                <br />
                Select a contact to chat
              </div>
              <img
                key="whatsappLogo"
                id="whatsappLogo"
                className="whatsappLogo"
                src={IMAGES.WHATSAPP_LOGO_PNG}
                height="200px"
                width="200px"
              />
            </div>
          ) : (
            <>
              <nav className="navbar navbar-expand-lg navbar-light bg-light border-left">
                <img
                  className="avatar"
                  src={
                    getUserFromUid(recieverDetails?.uid, users)?.avatar ||
                    recieverDetails?.avatar ||
                    IMAGES.default
                  }
                  alt="Avatar"
                  key={recieverDetails?.uid || actualDbId || "uniqueID1"}
                  id={recieverDetails?.uid || actualDbId || "uniqueID1"}
                  onClick={() => {
                    setShowMemberEditFormOnTheRight(false);
                    setShowGroupInfoEditForm(true);
                  }}
                />

                {"  "}
                <div style={{width: "95%"}}>
                  <p>
                    {users?.find((user) => user.uid === actualDbId)
                      ?.groupName || recieverDetails?.name}
                  </p>
                </div>

                {recieverDetails?.participants?.length && (
                  <p className="singleChat text-primary blockquote-footer overflow-hidden">
                    {recieverDetails?.groupName &&
                      users
                        ?.find((user) => user.uid === actualDbId)
                        ?.participants?.map(
                          (member) => {
                            if (member?.uid === auth.currentUser.uid)
                              return `${getCurrentUser()?.name}, `;
                            return `${getUserFromUid(member?.uid, users)?.name
                              }, `;
                          } //(users?.find(user=>user.uid === actualDbId))
                        )}
                  </p>
                )}
                {recieverDetails?.groupName &&
                  isAdmin() &&
                  actualDbId?.length > auth.currentUser.uid.length && (
                    <>
                      <button
                        style={{border: "none"}}
                        onClick={() => {
                          //MODAL SELECTPARTS
                          if (recieverDetails?.groupName) {
                            setShowGroupInfoEditForm(false);
                            setShowMemberEditFormOnTheRight(true);
                          }
                        }}
                      >
                        {edit}
                      </button>
                    </>
                  )}
              </nav>

              {fileStatus ? (
                <>
                  <Header
                    title=""
                    goBack={() => {
                      setLoading(false);
                      setFileStatus(false);
                    }}
                  />
                  <div style={{background: "#bfc7cc00", height: "68%"}}>
                    {img && (
                      <div className="uploadedImage">
                        <label className="center" style={{display: "block"}}>
                          {imgName}
                        </label>
                        <img
                          className="uploadImg"
                          id="uploadImg"
                          key="uploadImg"
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
                  </div>
                </>
              ) : (
                <div className="scroll-right">
                  <ul className="paddingzero">
                    {messages?.map((message, idx) => {
                      const cssStr =
                        message.uid === auth.currentUser.uid
                          ? "-sender"
                          : "-reciever";
                      if (!(message.text || message.img || message.pdf))
                        return null;
                      return (
                        <div className={`w-100 allignedRight chat${cssStr}`}>
                          <div
                            ref={refHook}
                            className={`container${cssStr} shadow`}
                          >
                            {recieverDetails?.groupName && (
                              <span>
                                {recieverDetails?.groupName &&
                                  cssStr === "-reciever" && (
                                    <img
                                      key={message.createdAt}
                                      id={message.createdAt}
                                      style={{display: "inline"}}
                                      className="avatar"
                                      src={
                                        getUserFromUid(message?.uid, users)
                                          ?.avatar
                                      }
                                    />
                                  )}
                                {cssStr === "-reciever" && (
                                  <p
                                    className="ml-75 text-info blockquote-footer"
                                    style={{display: "inline"}}
                                  >
                                    {recieverDetails?.groupName &&
                                      getUserFromUid(message?.uid, users)?.name}
                                  </p>
                                )}
                              </span>
                            )}
                            <p>{message.text}</p>
                            {message?.img && (
                              <a target="blank" href={message?.img} download>
                                <img
                                  src={message?.img}
                                  alt="img"
                                  height="100px"
                                  width="100px"
                                />
                              </a>
                            )}
                            {message?.pdf && (
                              <a target="blank" href={message?.pdf} download>
                                {filePdf}
                                {`\n${message?.fileName}`}
                              </a>
                            )}
                            <span className="time-right">{message?.time}</span>
                          </div>
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
              </FileContext.Provider>
            </>
          )}
        </div>
        {showGroupInfoEditForm && recieverDetails?.groupName && (
          <div className="d-block">
            <Header
              title="Group Info"
              goBack={() => setShowGroupInfoEditForm(false)}
            />
            <br />
            <br />
            <UserProfile
              activeUser={recieverDetails}
              setActiveUser={setRecieverDetails}
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
    </div>
  );
}

export default LiveChat;
