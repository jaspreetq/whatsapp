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
  
  const handleEnter = (e) => (e.key === "Enter") && handleSend()
  const { uid, displayName, photoURL } = auth.currentUser;

  const handleSend = async () => {
    const messageLocal = message;
    setMessage("");
    if (messageLocal.trim() === "") {
      alert("Enter valid message");
      return;
    }
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

      // const docRef = await getDoc(doc(db, "chats", actualDbId));
      // if (!docRef.exists()) return null;
      // console.log("doesn't exist", actualDbId, docRef.exists());
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
      <div style={{ width: "98%" }}>
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
