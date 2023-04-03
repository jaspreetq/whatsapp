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

  const param = useParams();
  // const [user] = useAuthState(auth);
  // console.log("user<><><><.", user, param)
  // const docRef = collection(db, "messages");

  setErrorMessage("");
  // param = activeUser.name

  useEffect(() => {
    const messageList = [];
    Object.keys(recieverDetails).length && setWelcomeChatPage(false);

    console.log(
      "actualDbId in useEffect(LiveCHat) b4:",
      recieverDetails,
      actualDbId
    );

    const unsubscribe = onSnapshot(
      doc(db, "chats", actualDbId || "4pcCQ1QwuaoG362WaGtm"),
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
  }, [actualDbId, recieverDetails]);

  return (
    //RecieveChat
    <div className="liveChat">
      {/* {!auth.currentUser.uid && console.log("null chak")} */}
      <SignOut />
      <div class="d-flex justify-content-start">
        <SideBar />

        <div>
          {welcomeChatPage ? (
            <div class="align-middle w-100 h-50"> Select a contact to chat</div>
          ) : (
            <div>
              <>
                {recieverDetails.name}
                <ul>
                  {messages?.map((message) => {
                    console.log("message:::", message);
                    const cssStr =
                      message.uid == recieverDetails.uid
                        ? "-reciever"
                        : "-sender";
                    console.log("cssStr: ", cssStr);
                    return (
                      <div className={`container${cssStr}`}>
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
      {/* {setRecieverDetails?.map()} */}
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
