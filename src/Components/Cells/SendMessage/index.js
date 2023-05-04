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
import { FileContext } from "../../../View/LiveChat";
import Loader from "../../Atoms/Loader";
import { attachement } from "../../Utillities/icons";

function SendMessage() {
  // State to store uploaded file
  const [file, setFile] = useState("");
  // progress
  const [percent, setPercent] = useState(0);
  const [fileSizeError,setFileSizeError] = useState("")
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
    if(e.target.files[0]?.size > 16777216)
    {
      setFileSizeError("Too large to upload ,Limit the file size to 16MB");
      return;
    }
    document.getElementsByClassName(" react-input-emoji--input")?.[0].focus();
    // setFileStatus(true)
    setImg(null)
    setPdf(null)
    
    if (
      e.target.files[0].type == "image/png" ||
      e.target.files[0].type == "image/jpeg"
    ) {
      setLoading(true)
      setImg(e.target.files[0]);
      setImgName(e.target.files[0].name);
      setFileStatus(true);
    } else {
      setLoading(true)
      setPdf(e.target.files[0]);
      setPdfName(e.target.files[0].name);
      setFileStatus(true);
    }
    e.target.value = null;
    // setFile(event.target.files[0]);
  }

  const handleEnter = (e) => e.key === "Enter" && handleSend();
  const { uid, displayName, photoURL } = auth.currentUser;

  const handleUpload = async () => {
    setFileStatus(false)

    if (img) {
      const localFileNewURL = `/files/${img.name}${auth.currentUser.uid}`;
      const storageRef = ref(storage, localFileNewURL);
      const uploadTask = uploadBytesResumable(storageRef, img);
      setImg(null)
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
            
            setLoading(true)
            await updateDoc(doc(db, "chats", actualDbId), {
              lastChatedAt:serverTimestamp(),
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
            setLoading(false)
          });
        }
      );
    } else if (pdf) {
      const localFileNewURL = `/files/${pdf.name}${auth.currentUser.uid}`;
      const storageRef = ref(storage, localFileNewURL);
      const uploadTask = uploadBytesResumable(storageRef, pdf);
      
      // setFileUrl(localFileNewURL)
      setPdf(null)
      uploadTask.then(
        () => {
      
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            setPdfUrl(url);
            setFileUrl(url);
      
            pdfURL = url;
            setLoading(true)
            await updateDoc(doc(db, "chats", actualDbId), {
              lastChatedAt:serverTimestamp(),
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
            setLoading(false)
          });
        }
      );
    }
    else{
      
      
       message?.trim() && await updateDoc(doc(db, "chats", actualDbId), {
        lastChatedAt:serverTimestamp(),
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
    })

    console.log(recieverDetails,message," recieverDetails")
    recieverDetails?.groupName &&
      (await updateDoc(doc(db, "users", recieverDetails.uid), {
        uid: recieverDetails.uid,
        groupName: recieverDetails?.groupName,
        participants: [...recieverDetails?.participants],
        avatar: recieverDetails.avatar, //random array dp generator
        createdAt: recieverDetails.createdAt,
        creatorUid: recieverDetails.creatorUid,
        lastChat:{...(recieverDetails?.lastChat || {}),[recieverDetails?.uid]:message}
      }));

      //1on1
      recieverDetails?.name &&
      (await updateDoc(doc(db, "users", recieverDetails?.uid), {
        uid: recieverDetails.uid,
        name: recieverDetails.name,
        email: recieverDetails.email,
        avatar: recieverDetails.avatar, //random array dp generator
        createdAt: recieverDetails.createdAt,
        lastChat:{...(recieverDetails?.lastChat || {}),[actualDbId]:message}
      })
      
      );

      (await updateDoc(doc(db, "users", activeUser?.uid), {
        uid: activeUser.uid,
        name: activeUser.name,
        email: activeUser.email,
        avatar: activeUser.avatar, //random array dp generator
        createdAt: activeUser.createdAt,
        lastChat:{...(activeUser?.lastChat || {}),[actualDbId]:message}
      })
      
      );

  }
    setText("");
    setImg(null);
    setPdf(null);
    setPdfName("")
    setImgUrl("")
    setFileUrl("")
    setMessage("");
    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
  };

  const handleSend = async () => {
    handleUpload();
  };

  return (
    <div>
      <div className="d-flex justify-content-start file-upload">
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
           {attachement}
          </label>
          <input
            id="attachement"
            style={{ display: "contents" }}
            type="file"
            onChange={handleFileChange}
            accept="image/*,application/pdf,video/mp4,video/x-m4v,video/*,.mp3,audio/*"
          />
          {/* style={{"border-style": "none","padding":0 }} */}
        </div>
        {/* */}

        {/* onClick={handleUpload} */}
        {/* <button style={{"border-style": "none"}} onClick={}>📎</button> */}
        <div>
          <button className="send-message" onClick={() => {handleSend()}}>
            Send
          </button>
        </div>
      </div>
      {/* <p color="green">{percent}% done</p> */}
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


// const messageLocal = message;
    // setMessage("");
    // if (messageLocal?.trim() === "" && !img && !pdf) {
    //   alert("Enter valid message");
    //   return;
    // }
    // console.log("activeUser,pdfURL,imgURL :", activeUser, pdfURL, imgURL || "");
    // setOutputMessage(messageLocal);
    // if (actualDbId) {
    //   await updateDoc(doc(db, "chats", actualDbId), {
    //     messages: arrayUnion({
    //       uid: activeUser?.uid,
    //       name: activeUser?.name,
    //       avatar: activeUser?.avatar,
    //       createdAt: new Date().toUTCString(),
    //       pdf: pdfURL || "",
    //       fileName: (pdfName ? pdfName : imgName) || "",
    //       img: imgURL || "",
    //       time: getTime(),
    //       text: message || "",
    //     }),
    //   });
    // }

    //chats,



// import { storage } from "./firebase";

// // <img src={activeUser?.photoURL}/>
// console.log(
//   "messageLocal,actualDbId,existingContact : ",
//   messageLocal,
//   actualDbId
//   // existingContact
// );
//-----------------------------------------------------------------------------------
// useEffect(() => {
//   let id = setTimeout(() => {
//     //searched records
//     let filteredArr = records?.filter((record) => {
//       let arrOfVals = Object.values(record).map((val) =>
//         val.toString().toLowerCase()
//       );
//       let lowerCaseSearch = searchedTerm.toLowerCase();
//       return arrOfVals?.some((val) => val.includes(lowerCaseSearch));
//     });
//     console.log(filteredArr);
//     setLoading(false);
//     setFilteredRecords(filteredArr);
//   }, 500);
//   console.log(filteredRecords);

//   return () => {
//     setLoading(true);
//     clearTimeout(id);
//   };

//   // setLoading(false);
// }, [searchedTerm]);

// useEffect(() => {
//   if (searchedTerm === "") setDisplayRecords(records);
//   else setDisplayRecords(filteredRecords);
// }, [filteredRecords]);