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
  } = useContext(messageContext);
  let dbId;

  const param = useParams();
  setErrorMessage("");

  useEffect(() => {
    // console.log("actualDbId: effect,reciever", );
    if (recieverDetails?.groupName) {
      setActualDbId(recieverDetails?.uid);
    } else {
      dbId =
        recieverDetails.uid > activeUser.uid
          ? recieverDetails.uid + activeUser.uid
          : activeUser.uid + recieverDetails.uid;
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
          senderUid: activeUser.uid,
          senderName: activeUser.name,
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
    Object.keys(recieverDetails).length && setWelcomeChatPage(false);
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

  return (
    //RecieveChat
    <div className="liveChat">
      <SignOut />

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
                <img className="avatar" src={IMAGES.default} alt="Avatar" />
                {"  "}
                <h6>{recieverDetails?.name || recieverDetails?.groupName}</h6>
                {/* <button>+</button> */}
              </nav>
              <div className="scroll-right" style={{ height: "397px" }}>
                <ul>
                  {messages?.map((message) => {
                    console.log("message:::", message);
                    const cssStr =
                      message.uid === auth.currentUser.uid
                        ? "-sender"
                        : "-reciever";
                    console.log("cssStr: ", cssStr);
                    return (
                      <div className={`container${cssStr}`}>
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
// param = activeUser.name

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
