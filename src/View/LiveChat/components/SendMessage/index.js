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
import { getUserFromUid } from "../../Utillities/getUserFromUid";
import getActiveUserId from "../../Utillities/getActiveUserId";

function SendMessage() {
  // State to store uploaded file
  const [file, setFile] = useState("");
  // progress
  const [percent, setPercent] = useState(0);
  const [fileSizeError, setFileSizeError] = useState("");
  const {
    outputMessage,
    setOutputMessage,
    text,
    setText,
    img,
    setImg,
    imgName,
    setImgName,
    pdf,
    setPdf,
    pdfName,
    setPdfName,
    loading,
    setLoading,
    fileStaus,
    setFileStatus,
    invalid,
    setInvalid,
    imgUrl,
    setImgUrl,
    pdfUrl,
    setPdfUrl,
    fileUrl,
    setFileUrl,
  } = useContext(FileContext);
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
    users,
    setUsers,
    lastMessage,
    setLastMessage,
  } = useContext(messageContext);

  function handleFileChange(e) {
    if (e.target.files[0]?.size > 16777216) {
      setFileSizeError("Too large to upload ,Limit the file size to 16MB");
      return;
    }
    document.getElementsByClassName(" react-input-emoji--input")?.[0].focus();
    // setFileStatus(true)
    setImg(null);
    setPdf(null);

    if (
      e.target.files[0].type == "image/png" ||
      e.target.files[0].type == "image/jpeg"
    ) {
      setLoading(true);
      setImg(e.target.files[0]);
      setImgName(e.target.files[0].name);
      setFileStatus(true);
    } else {
      setLoading(true);
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
    setFileStatus(false);

    if (img) {
      const localFileNewURL = `/files/${img.name}${auth.currentUser.uid}`;
      const storageRef = ref(storage, localFileNewURL);
      const uploadTask = uploadBytesResumable(storageRef, img);
      setImg(null);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );

          // update progress
          setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            setImgUrl(url);
            imgURL = url;

            setLoading(true);
            await updateDoc(doc(db, "chats", actualDbId), {
              lastChatedAt: serverTimestamp(),
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
            setLoading(false);
          });
        },
      );
    } else if (pdf) {
      const localFileNewURL = `/files/${pdf.name}${auth.currentUser.uid}`;
      const storageRef = ref(storage, localFileNewURL);
      const uploadTask = uploadBytesResumable(storageRef, pdf);

      // setFileUrl(localFileNewURL)
      setPdf(null);
      uploadTask.then(() => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          setPdfUrl(url);
          setFileUrl(url);

          pdfURL = url;
          setLoading(true);
          await updateDoc(doc(db, "chats", actualDbId), {
            lastChatedAt: serverTimestamp(),
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
          setLoading(false);
        });
      });
    } else {
      message?.trim() &&
        (await updateDoc(doc(db, "chats", actualDbId), {
          lastChatedAt: serverTimestamp(),
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
            // read:
          }),
        }));
      const dbId =
        recieverDetails?.uid > activeUser?.uid
          ? recieverDetails?.uid + activeUser?.uid
          : activeUser?.uid + recieverDetails?.uid;

      const recieverWithNewChatCnt = {};

      recieverDetails?.groupName &&
        Object.keys(recieverDetails?.unseenMessageCount)?.map((key) => {
          if (key === activeUser?.uid) return (recieverWithNewChatCnt[key] = 0);
          return (recieverWithNewChatCnt[key] =
            getUserFromUid(recieverDetails?.uid, users)?.unseenMessageCount[
              key
            ] + 1);
        });

      recieverDetails?.name &&
        Object.keys(
          getUserFromUid(recieverDetails?.uid, users)?.unseenMessageCount,
        )?.map((key) => {
          if (
            key.includes(activeUser?.uid) &&
            key.includes(recieverDetails?.uid)
          ) {
            recieverWithNewChatCnt[key] =
              getUserFromUid(recieverDetails?.uid, users)?.unseenMessageCount[
                key
              ] + 1;
          }
        });

      if (
        recieverDetails?.name &&
        !getUserFromUid(recieverDetails?.uid, users)?.unseenMessageCount?.[
          actualDbId
        ]
      ) {
        const objChatIdMessage = {};

        const asyncCountUpdate = async () =>
          await updateDoc(doc(db, "users", recieverDetails?.uid), {
            uid: recieverDetails?.uid,
            name: recieverDetails?.name,
            email: recieverDetails?.email,
            avatar: recieverDetails?.avatar, //random array dp generator
            createdAt: recieverDetails?.createdAt,
            lastChat: {
              ...(recieverDetails?.lastChat || {}),
              [actualDbId]: message,
            },
            unseenMessageCount: {
              ...getUserFromUid(recieverDetails?.uid, users)
                ?.unseenMessageCount,
              ...{ [actualDbId]: 1 },
            },
          });
        recieverDetails?.name && asyncCountUpdate();
      } else {
        //1on1
        recieverDetails?.name &&
          (await updateDoc(doc(db, "users", recieverDetails?.uid), {
            uid: recieverDetails?.uid,
            name: recieverDetails?.name,
            email: recieverDetails?.email,
            avatar: recieverDetails?.avatar, //random array dp generator
            createdAt: recieverDetails?.createdAt,
            lastChat: {
              ...(recieverDetails?.lastChat || {}),
              [actualDbId]: message,
            },
            unseenMessageCount: recieverWithNewChatCnt,
          }));
      }

      recieverDetails?.groupName &&
        (await updateDoc(doc(db, "users", recieverDetails?.uid), {
          uid: recieverDetails?.uid,
          groupName: recieverDetails?.groupName,
          participants: [...recieverDetails?.participants],
          avatar: recieverDetails?.avatar, //random array dp generator
          createdAt: recieverDetails?.createdAt,
          creatorUid: recieverDetails?.creatorUid,
          lastChat: {
            [activeUser?.uid]: message,
          },
          unseenMessageCount: recieverWithNewChatCnt,
        }));

      await updateDoc(doc(db, "users", activeUser?.uid), {
        uid: activeUser.uid,
        name: activeUser.name,
        email: activeUser.email,
        avatar: activeUser.avatar, //random array dp generator
        createdAt: activeUser.createdAt,
        lastChat: {
          ...(getUserFromUid(activeUser?.uid, users)?.lastChat || {}),
          [actualDbId]: message,
        },
        unseenMessageCount: getUserFromUid(activeUser?.uid, users)
          .unseenMessageCount,
      });
    }
    setText("");
    setImg(null);
    setPdf(null);
    setPdfName("");
    setImgUrl("");
    setFileUrl("");
    setLastMessage(message);
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

        <div className="sendMessageArea">
          <label htmlFor="attachement">{attachement}</label>
          <input
            id="attachement"
            style={{ display: "contents" }}
            type="file"
            onChange={handleFileChange}
            accept="image/*,application/pdf,video/mp4,video/x-m4v,video/*,.mp3,audio/*"
          />
        </div>
        <div>
          <button
            className="send-message"
            onClick={() => {
              handleSend();
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
export default SendMessage;
