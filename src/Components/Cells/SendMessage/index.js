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
// // <img src={activeUser?.photoURL}/>
// console.log(
//   "messageLocal,actualDbId,existingContact : ",
//   messageLocal,
//   actualDbId
//   // existingContact
// );
function SendMessage() {
  const [outputMessage,setOutputMessage] = useState("");
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
  
  
  const handleEnter = (e) => (e.key === "Enter") && handleSend()
  const { uid, displayName, photoURL } = auth.currentUser;

  const handleSend = async () => {
    const messageLocal = message;
    setMessage("");
    if (messageLocal.trim() === "") {
      alert("Enter valid message");
      return;
    }
    
     setOutputMessage(messageLocal);
      if (actualDbId) {
        await updateDoc(doc(db, "chats", actualDbId), {
          messages: arrayUnion({
            uid: activeUser?.uid,
            name: activeUser?.name,
            avatar: IMAGES.default,
            createdAt: new Date().toUTCString(),
            text: messageLocal,
          }),
        });
      }

      //chats,
    };

    return (
      <div className="input-chat">
        <input
          id="newMessage"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          type="text"
          placeholder="Send Message..."
          onKeyDown={(e)=>handleEnter(e)}
        />
        <button onClick={(e) => handleSend(e)}>Send</button>
      </div>
    );
  }
export default SendMessage;

  // useEffect(()=>{
  //   const updateDocumentAsync = async ()=>await updateDoc(doc(db, "chats", actualDbId), {
  //     messages: arrayUnion({
  //       uid: activeUser?.uid,
  //       name: activeUser?.name,
  //       avatar: IMAGES.default,
  //       createdAt: new Date().toUTCString(),
  //       text: outputMessage,
  //     }),
  //   });
  //   const docRef = await getDoc(doc(db, "chats", actualDbId));
  //     if (docRef.exists() || !actualDbId) return null;
  //   if (outputMessage && actualDbId )updateDocumentAsync()
    
  // }
  // ,[outputMessage]);