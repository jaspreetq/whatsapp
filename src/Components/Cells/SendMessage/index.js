import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { messageContext } from "../../../App";
import { auth, db } from "../../../firebase";
import "./styles.css";
function SendMessage() {
  const messageState = useContext(messageContext);
  const { message, setMessage } = messageState;
  // setMessage("dsf")
  // const handleSend = () => { setMessage("") };
  const refDbMessages = collection(db, "messages");
  //refDbMessages.add({})
  const handleEnter = (e) => e.key == "Enter" && handleSend();

  const handleSend = async (event) => {
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    const { uid, displayName, photoURL } = auth.currentUser;
    await addDoc(collection(db, "messages"), {
      uid,
      name: displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      text: message,
      details:
    });
    setMessage("");
    //chats, 
  };

  //   return (
  //     <form onSubmit={(event) => sendMessage(event)} className="send-message">
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
        onKeyDown={handleEnter}
      />
      <button onClick={(e) => handleSend(e)}>Send</button>
    </div>
  );
}

export default SendMessage;
