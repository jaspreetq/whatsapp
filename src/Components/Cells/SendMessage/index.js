import "./styles.css";
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
import { uuidv4 } from "@firebase/util";

function SendMessage() {
  
  const [img, setImg] = useState(null);
  const [imgName, setImgName] = useState("");
  const [pdf, setPdf] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileStatus, setFileStatus] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [imgUrl, setImgUrl] = useState(false);
  const [fileUrl, setFileUrl] = useState(false);

  useEffect(()=>{
    setMessage("");
    setImg(null);
  },[actualDbId])

  const getCurrentTime = ()=> {
    const date = new Date();
    const time = date.getMinutes() < 10 ? `${date.getHours()}:0${date.getMinutes()}` : `${date.getHours()}:${date.getMinutes()}`;
    return {date,time};
  }
  console.log("getNewUrl() : ",getCurrentTime())
  // useEffect(() => {
  //   setText("")
  //   setImg(null)
  // }, [data])


  //-----------------------------
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
  
  const handleEnter = (e) => (e.key === "Enter") && handleSend()
  const { uid, displayName, photoURL } = auth.currentUser;
  
  const handleSend = async () => {
    setFileStatus(false)
    setMessage("");
    setImg(null);
    setPdf(null);
    setPdfName("")
    setImgUrl("")
    setFileUrl("")
    if (img) {
      setLoading(true)
      const storageRef = ref(storage, getNewUrl());

      const uploadTask = uploadBytesResumable(storageRef, img || pdf);

      uploadTask.on(
        (error) => {
          console.log(error, "Error in uploading files")
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            setLoading(false)
            setImgUrl(downloadURL)
            await updateDoc(doc(db, "chats", actualDbId || "323dfa2rel1"), {
              messages: arrayUnion({
                uid: activeUser?.uid,
            name: activeUser?.name,
            avatar: activeUser?.photoURL,// IMAGES.default
            createdAt: new Date().toUTCString(),
            date:getCurrentTime.date,
            time:getCurrentTime.time,
            text: messageLocal,
                id: uuid(),
                text:message,
                senderId: currentUser.uid,
                date: time,
                img: img && downloadURL,
                fileName: imgName && imgName
      
              }),
      
      
            })

          });
        }
      );
    }
    else if (pdf || fileUrl) {

      setLoading(true)
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, pdf);
      uploadTask.then(
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {

            setLoading(false)
            setFileUrl(downloadURL)
            await updateDoc(doc(db, "chats", data.groupId || data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text:message,
                senderId: currentUser.uid,
                date: time,
                file: pdf && downloadURL,
                fileName: pdfName && pdfName
              }),
      
      
            }
            );

          });
        }
      );
    }
  
    else {
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
            avatar: activeUser?.photoURL,// IMAGES.default
            createdAt: new Date().toUTCString(),
            date:getCurrentTime.date,
            time:getCurrentTime.time,
            text: messageLocal,
          }),
        });
      }
    }
    
    
      
      //chats,
    };


    return (
      <>
        <div className="inputdata">
          <div id="Hello"
            className="inputText" >
            <InputEmoji
              value={message}
              onChange={setMessage}
              cleanOnEnter
              onEnter={() => { handleSend() }}
              placeholder="Type a message"
              borderColor="white"
    
            />
          </div>
          <div className="send">
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
            <label htmlFor="pdf">
              <img className="messimage" src={Attach} alt="" />
            </label>
            {/* {!fileUrl&&pdf&&<img  src={upload} alt="upload" onClick={() => { handleUpload() }}></img>}
            {!imgUrl&&img&&<img  src={upload} alt="upload" onClick={() => { handleUpload() }}></img>}
            {imgUrl&&<img  src={uploaded} alt="upload" onClick={() => {setFileStatus(true) }}></img>}
            {fileUrl&&<img  src={uploaded} alt="upload" onClick={() => {setFileStatus(true)}}></img>} */}
            {message.trim() || imgUrl || fileUrl ? <img src={send} alt="send" className="sendbutton" onClick={handleSend}></img> : null}
          </div>
          <Display show={fileStatus} setShow={setFileStatus} showFoot={true} setImgUrl={setImgUrl} setFileUrl={setFileUrl} handleSend={handleSend}>
            <div>
              <div>
    
                {img &&<div className="uploadedImage">
                  <img className="uploadImg" src={URL.createObjectURL(img)}></img>
                  <label>{imgName}</label>
                </div>}
    
                  
    
                {pdf&&<div className="uploadedImage">
                  <object data={URL.createObjectURL(pdf)} width="300" height="300"></object>
                  <label>{pdfName}</label>
                </div>}
    
              
              </div>
    
            </div>
          </Display>
    
          <Modal show={loading}>
            <label>loading</label>
          </Modal>
          <Modal show={invalid} setShow={setInvalid} showFoot={true}>
    
            <label>Choosen Data Is Not Supported</label>
          </Modal>
        </div>
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
          📎
          {/* <input id="attachement" value= */}
          <button onClick={(e) => handleSend(e)}>Send</button>
        </div>
      </>
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
  
  // // <img src={activeUser?.photoURL}/>
  // console.log(
  //   "messageLocal,actualDbId,existingContact : ",
  //   messageLocal,
  //   actualDbId
  //   // existingContact
  // );


  // useEffect(() => {
  //   console.log("useEffect(Send Message) actualDbId changed ", actualDbId);
  // }, [actualDbId]);