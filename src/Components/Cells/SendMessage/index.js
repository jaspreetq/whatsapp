import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { useContext, useEffect, useState, useRef } from "react";
import { messageContext } from "../../../App";
import { auth, db, storage } from "../../../firebase";
import { IMAGES } from "../../Utillities/Images";
import InputEmoji from "react-input-emoji";
import "./styles.css";
import { RANDOM_TEXT } from "../../../ConstantString";
import { getTime } from "../../Utillities/getTime";
import { FileContext } from "../../LiveChat";

// import { storage } from "./firebase";

// // <img src={activeUser?.photoURL}/>
// console.log(
//   "messageLocal,actualDbId,existingContact : ",
//   messageLocal,
//   actualDbId
//   // existingContact
// );
function SendMessage() {
  // State to store uploaded file
  const [file, setFile] = useState("");
  // progress
  const [percent, setPercent] = useState(0);
  const { outputMessage, setOutputMessage, text, setText, img, setImg, imgName, setImgName, pdf, setPdf, pdfName, setPdfName, loading, setLoading, fileStaus, setFileStatus, invalid, setInvalid, imgUrl, setImgUrl, pdfUrl, setPdfUrl, fileUrl, setFileUrl} = useContext(FileContext)
  let imgURL, pdfURL;
  const date = new Date();
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

  // useEffect(() => {
  //   console.log("useEffect(Send Message) actualDbId changed ", actualDbId);
  // }, [img]);

  function handleFileChange(e) {
    document.getElementsByClassName(" react-input-emoji--input")?.[0].focus();
    // setFileStatus(true)
    if (
      e.target.files[0].type == "image/png" ||
      e.target.files[0].type == "image/jpeg"
    ) {
      setImg(e.target.files[0]);
      setImgName(e.target.files[0].name);
      setFileStatus(true);
    } else {
      setPdf(e.target.files[0]);
      setPdfName(e.target.files[0].name);
      setFileStatus(true);
    }
    e.target.value = null;
    // setFile(event.target.files[0]);
  }

  const handleEnter = (e) => e.key === "Enter" && handleSend();
  const { uid, displayName, photoURL } = auth.currentUser;

  const handleUpload = () => {
    setFileStatus(false)
    if (img) {
      const localFileNewURL = `/files/${img.name}${auth.currentUser.uid}`;
      const storageRef = ref(storage, localFileNewURL);
      const uploadTask = uploadBytesResumable(storageRef, img);
      setImg("")
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            setImgUrl(url);
            imgURL = url;
            console.log(url, imgURL, "url ::");
            await updateDoc(doc(db, "chats", actualDbId), {
              messages: arrayUnion({
                uid: activeUser?.uid,
                name: activeUser?.name,
                avatar: activeUser?.avatar,
                createdAt: new Date().toUTCString(),
                pdf: pdfURL || "",
                fileName: imgName,
                img: imgURL || "",
                time: getTime(),
                text: message || "",
              }),
            });
          });
        }
      );
    } else if (pdf) {
      const localFileNewURL = `/files/${pdf.name}${auth.currentUser.uid}`;
      const storageRef = ref(storage, localFileNewURL);
      const uploadTask = uploadBytesResumable(storageRef, pdf);
      console.log("in pdf::::::::::",pdf,localFileNewURL);
      // setFileUrl(localFileNewURL)
      setPdf("")
      uploadTask.then(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          console.log("next log");
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            setPdfUrl(url);
            console.log("urlurl", url);
            pdfURL = url;
            await updateDoc(doc(db, "chats", actualDbId), {
              messages: arrayUnion({
                uid: activeUser?.uid,
                name: activeUser?.name,
                avatar: activeUser?.avatar,
                createdAt: new Date().toUTCString(),
                pdf: url || "",
                fileName: (pdfName ? pdfName : imgName) || "",
                // img: imgURL || "",
                time: getTime(),
                text: message || "",
              }),
            });
          });
        }
      );
    }
    setText("");
    setImg(null);
    setPdf(null);
    setPdfName("")
    setImgUrl("")
    setFileUrl("")

    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
  };

  const handleSend = async () => {
    handleUpload();
    const messageLocal = message;
    setMessage("");
    if (messageLocal?.trim() === "" && !img && !pdf) {
      alert("Enter valid message");
      return;
    }
    console.log("activeUser,pdfURL,imgURL :", activeUser, pdfURL, imgURL || "");
    setOutputMessage(messageLocal);
    if (actualDbId) {
      await updateDoc(doc(db, "chats", actualDbId), {
        messages: arrayUnion({
          uid: activeUser?.uid,
          name: activeUser?.name,
          avatar: activeUser?.avatar,
          createdAt: new Date().toUTCString(),
          pdf: pdfURL || "",
          fileName: (pdfName ? pdfName : imgName) || "",
          img: imgURL || "",
          time: getTime(),
          text: message || "",
        }),
      });
    }

    //chats,
  };

  return (
    <div>
      <div className="d-flex justify-content-start file-upload">
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
          onEnter={() => handleSend()}
          placeholder="Type a message"
        />
        {/* <label htmlFor="file">
        
      </label> */}

        {/* display:contents */}
        <div>
          <label htmlFor="attachement">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="90"
              fill="#73777a"
              class="bi bi-paperclip"
              viewBox="0 0 16 16"
            >
              <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z" />
            </svg>
          </label>
          <input
            id="attachement"
            style={{ display: "contents" }}
            type="file"
            onChange={handleFileChange}
            accept="image/*,application/pdf"
          />
          {/* style={{"border-style": "none","padding":0 }} */}
        </div>
        {/* */}

        {/* onClick={handleUpload} */}
        {/* <button style={{"border-style": "none"}} onClick={}>📎</button> */}
        <div>
          <button className="send-message" onClick={(e) => handleSend(e)}>
            Send
          </button>
        </div>
      </div>
      <p color="green">{percent}% done</p>
    </div>
  );
}
export default SendMessage;

{
  /* // useEffect(()=>{ */
}
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

// import { useState } from "react";

// function App() {

//   // Handle file upload event and update state

// }

{
  /* <input
        type="file"
        style={{ display: "contents" }}
        id="file"
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
      /> */
}

// ---------------------
// getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
//   setImgUrl(url);
//   console.log("getDownloadURL: ", imgUrl, activeUser);
//   await updateDoc(doc(db, "chats", actualDbId), {
//     message: arrayUnion({
//       uid: auth.currentUser.id,
//       name: activeUser?.name,
//       avatar: activeUser?.avatar,
//       createdAt: new Date().toUTCString(),
//       img: img && url,
//       fileName: imgName ? imgName : "",
//       time: getTime(),
//       text: message,
//     }),
//   });
// });

// ----------------
// getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
//   setPdfUrl(url);
//   await updateDoc(doc(db, "chats", actualDbId || RANDOM_TEXT), {
//     message: arrayUnion({
//       uid: auth.currentUser.id,
//       name: activeUser?.name,
//       avatar: activeUser?.avatar,
//       createdAt: new Date().toUTCString(),
//       pdf: pdf && url,
//       fileName: pdfName ? pdfName : "",
//       time: getTime(),
//       text: message,
//     }),
//   });
// });
