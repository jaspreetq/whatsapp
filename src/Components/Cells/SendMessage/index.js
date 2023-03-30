import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { messageContext } from "../../../App";
import { auth, db } from "../../../firebase";
import { IMAGES } from "../../Utillities/Images";
import "./styles.css";
function SendMessage() {
  const { message, setMessage,email, activeUser,setActiveUser,recieverDetails, setRecieverDetails} = useContext(messageContext);
  // setMessage("dsf")
  // const handleSend = () => { setMessage("") };
  const refDbMessages = collection(db, "messages");
  //refDbMessages.add({})
  const handleEnter = (e) => e?.key == "Enter" && handleSend();
  
  const handleSend = async (event) => {
    const messageLocal = message;
    setMessage("");
    if (messageLocal.trim() === "") {
      alert("Enter valid message");
      return;
    }
    const { uid, displayName, photoURL } = auth.currentUser;
    console.log("name<><><<>< ",recieverDetails,activeUser?.uid,activeUser?.name,activeUser?.photoURL)
          // <img src={activeUser?.photoURL}/>
    messageLocal && await updateDoc(doc(db, "chats", recieverDetails?.uid+activeUser?.uid), {
      messages: arrayUnion({
          uid:activeUser?.uid,
          name:activeUser?.name,
          avatar: IMAGES.default,
          createdAt: ((new Date()).getHours()+":"+(new Date()).getMinutes()),
          text: messageLocal,
      }),
    });

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
