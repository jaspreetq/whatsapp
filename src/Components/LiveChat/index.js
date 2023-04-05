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
} from "firebase/firestore";
import SendMessage from "../Cells/SendMessage";
import SignOut from "../Atoms/SignOut";
import { messageContext } from "../../App";
import { getAuth } from "firebase/auth";
import SideBar from "../SideBar";
import { useParams } from "react-router-dom";
import { IMAGES } from "../Utillities/Images";

function LiveChat() {
  const {
    errorMessage,
    setErrorMessage,
    receiverDetails,
    setReceiverDetails,
    welcomeChatPage,
    setWelcomeChatPage,
    activeUser,
    actualDbId,
    setActualDbId,
    messages,
    setMessages,
  } = useContext(messageContext);

  const param = useParams();
  // const [user] = useAuthState(auth);
  // console.log("user<><><><.", user, param)
  // const docRef = collection(db, "messages");

  setErrorMessage("");
  // param = activeUser.name

  useEffect(() => {
    const messageList = [];
    Object.keys(receiverDetails).length && setWelcomeChatPage(false);

    console.log(
      "actualDbId in useEffect(LiveCHat) b4: test>>>>>>>>>",
      receiverDetails,
      actualDbId
    );

    const unsubscribe = onSnapshot(
      doc(db, "chats", actualDbId || "mLhwciwWGdy6WKbOlnrZ"),
      (doc) => {
        // doc?.exists() && setMessages(doc.data()?.messages);
        console.log(doc.data()?.messages, "doc.data()?.messages");
        doc?.exists() && setMessages(doc.data()?.messages);
        console.log("doc on snapshot data :", doc.data()?.messages, actualDbId);
        console.log("actualDbId in useEffect(LiveCHat) :", actualDbId);
        //setWelcomeChatPage(true);
      }
    );
    console.log("receiverDetails ", receiverDetails);
    unsubscribe();
  }, [actualDbId]);

  console.log("messages", messages);
  return (
    //RecieveChat
    <div className="liveChat">
      {/* {!auth.currentUser.uid && console.log("null chak")} */}
      <SignOut />
      <div className="d-flex justify-content-start">
        <SideBar />

        <div>
          {welcomeChatPage ? (
            <div className="align-middle w-100 h-50">
              {" "}
              Select a contact to chat
            </div>
          ) : (
            <div>
              <>
                {receiverDetails.name}
                <ul>
                  {messages?.map((message) => {
                    console.log("message:::", message);
                    const cssStr =
                      message.uid == receiverDetails.uid
                        ? "-receiver"
                        : "-sender";
                    console.log("cssStr: ", cssStr);
                    return (
                      <div className={`container${cssStr}`} key={message.uid}>
                        <p>{message.text}</p>
                        <span className="time-right">
                          {new Date(message?.createdAt).getHours() +
                            ":" +
                            new Date(message?.createdAt).getMinutes()}
                        </span>
                      </div>
                    );
                  })}
                </ul>

                <SendMessage />
              </>
            </div>
          )}
        </div>
      </div>
      {/* {setReceiverDetails?.map()} */}
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
