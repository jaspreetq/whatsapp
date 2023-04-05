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
    console.log(
      "actualDbId: effect,reciever",
      recieverDetails.name
    );
    dbId = (recieverDetails.uid > activeUser.uid)? recieverDetails.uid + activeUser.uid : (activeUser.uid + recieverDetails.uid)
    setActualDbId(dbId)
  }, [recieverDetails?.uid,activeUser?.uid]);


  useEffect(() => {
    console.log("useEffect(Send Message) actualDbId changed ", actualDbId);
    // console.log("dbId new",dbId)
    
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

    const unsubscribe = onSnapshot(
      doc(db, "chats", actualDbId || "dOy4H8cGozQz6Z8jyWfS"),
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
      {/* {!auth.currentUser.uid && console.log("null chak")} */}
      <SignOut />
      <div class="d-flex justify-content-start">
        <SideBar />

        <div>
        {/* welcomeChatPage */}
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