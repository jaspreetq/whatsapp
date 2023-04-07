import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import React, { useContext, useEffect, useState,useRef } from "react";
import { messageContext } from "../../../App";
import { auth, db } from "../../../firebase";
import { IMAGES } from "../../Utillities/Images";
import InputEmoji from "react-input-emoji";
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
    const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [imgName, setImgName] = useState("");
  const [pdf, setPdf] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileStatus, setFileStatus] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [imgUrl, setImgUrl] = useState(false);
  const [fileUrl, setFileUrl] = useState(false);
  const date = new Date()
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
      <div className="input">
        {/* <input
          id="newMessage"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          type="text"
          placeholder="Send Message..."
          onKeyDown={(e)=>handleEnter(e)}
        /> */}
        <InputEmoji
          value={message}
          onChange={setMessage}
          cleanOnEnter
          onEnter={()=>handleSend()}
          placeholder="Type a message"
        />

        <label for="pdf">📎</label>
        <input
          type="file"
          style={{ display: "contents" }}
          id="pdf"
          onChange={(e) => {

            if (e.target.value) {

              if (e.target.files[0]?.size > 10000000) {
                setInvalid(true)
              }
              else {
                document.getElementsByClassName("react-input-emoji--input")?.[0].focus()
                // setFileStatus(true)
                if (e.target.files[0].type == "image/png" || e.target.files[0].type == "image/jpeg") {
                  setImg(e.target.files[0])
                  setImgName(e.target.files[0].name)
                  setFileStatus(true)
                }
                else {
                  setPdf(e.target.files[0])
                  setPdfName(e.target.files[0].name)
                  setFileStatus(true)
                }
              }
              e.target.value = null;

            }
          }}
        />
        {/* <button style={{"border-style": "none"}} onClick={}>📎</button> */}
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

//   const FileUploader = ({onFileSelect}) => {
//     const fileInput = useRef(null)

//     const handleFileInput = (e) => {
//         // handle validations
//         onFileSelect(e.target.files[0])
//     }

//     return (
//         <div className="file-uploader">
//             <input type="file" onChange={handleFileInput}>
//             <button onClick={e => fileInput.current && fileInput.current.click()} className="btn btn-primary">
//         </div>
//     )
// }