import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import React, { useContext, useEffect, useState } from "react";
import { messageContext } from "../../../App";
import { auth, db } from "../../../firebase";
import { IMAGES } from "../../Utillities/Images";
import "./styles.css";
function SendMessage() {
  const {
    message,
    setMessage,
    email,
    activeUser,
    setActiveUser,
    recieverDetails,
    setRecieverDetails,
    actualDbId,
    setActualDbId,
  } = useContext(messageContext);

  useEffect(() => {
    console.log("useEffect(Send Message) actualDbId changed ", actualDbId);
  }, [actualDbId]);

  const handleSend = async () => {
    const messageLocal = message;
    setMessage("");
    if (messageLocal.trim() === "") {
      alert("Enter valid message");
      return;
    }
    const { uid, displayName, photoURL } = auth.currentUser;
    // const existingContact = await getDoc(doc(db, "chats", actualDbId));

    console.log(
      "name<><><<>< in send ",
      recieverDetails,
      activeUser?.uid,
      activeUser?.name,
      activeUser?.photoURL,
      actualDbId
      // existingContact.exists()
    );
    // <img src={activeUser?.photoURL}/>
    console.log(
      "messageLocal,actualDbId,existingContact : ",
      messageLocal,
      actualDbId
      // existingContact
    );
    messageLocal &&
      actualDbId &&
      (await updateDoc(doc(db, "chats", actualDbId), {
        messages: arrayUnion({
          uid: activeUser?.uid,
          name: activeUser?.name,
          avatar: IMAGES.default,
          createdAt: new Date().toUTCString(),
          text: messageLocal,
        }),
      }));

    //chats,
  };

  return (
    <div style={{ width: "98%" }}>
      <input
        id="newMessage"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        type="text"
        placeholder="Send Message..."
        // onKeyDown={handleEnter}
      />
      <button onClick={handleSend}>Send{message}</button>
    </div>
  );
}

export default SendMessage;
