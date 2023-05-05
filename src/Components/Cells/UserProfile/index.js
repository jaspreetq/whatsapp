import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useContext, useState } from "react";
import { auth, db, storage } from "../../../firebase";
import { rightArrow } from "../../Utillities/icons";
import { IMAGES } from "../../Utillities/Images";
import { messageContext } from "../../../App";
import "./styles.css"
import { getUserFromUid } from "../../Utillities/getUserFromUid";
//active user - 2meanings
function UserProfile({ activeUser,setActiveUser, setEditProfile, isGroup = false }) {
  const {users} = useContext(messageContext);
  const [userName, setUserName] = useState(
    getUserFromUid(activeUser?.uid,users).groupName || activeUser?.name
  );
  const [img, setImg] = useState("");
  const [imgName, setImgName] = useState("");
  const [fileStatus, setFileStatus] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  let imgURL;
  // const {welcomeChatPage,
  //   setWelcomeChatPage} = useContext(messageContext);
  function handleDpChange(e) {
    // setFileStatus(true)
    setImg(null);

    setImg(e.target.files[0]);
    setImgName(e.target.files[0].name);
    setFileStatus(true);

    e.target.value = null;
    // setFile(event.target.files[0]);

    // handleUpload()
    //MODAL --> HANDLE UPLOAD
  }

  // const handleEnter = (e) => e.key === "Enter" && handleSend();
  const handleNameChange = async () => {
    activeUser?.groupName &&
      userName?.trim() &&
      (await updateDoc(doc(db, "users", activeUser?.uid), {
        uid: activeUser.uid,
        groupName: userName,
        participants: [...getUserFromUid(activeUser.uid,users)?.participants],
        avatar: activeUser.avatar, //random array dp generator
        createdAt: activeUser.createdAt,
        creatorUid: activeUser.creatorUid,
        unseenMessageCount: activeUser?.unseenMessageCount
      }));

    activeUser?.name &&
      userName?.trim() &&
      (await updateDoc(doc(db, "users", activeUser?.uid), {
        uid: activeUser.uid,
        name: userName,
        email: activeUser.email,
        avatar: activeUser.avatar, //random array dp generator
        createdAt: activeUser.createdAt,
        unseenMessageCount: activeUser?.unseenMessageCount
      })
      
      );
      
  };

  const handleUpload = async () => {
    setFileStatus(false);

    if (img) {
      console.log("imgimgin", img);
      const localFileNewURL = `/profiles/${img.name}${auth.currentUser.uid}`;
      const storageRef = ref(storage, localFileNewURL);
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          // setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            setImgUrl(url);
            imgURL = url;
            console.log(url, imgURL, "url ::");
            activeUser?.groupName &&
              userName?.trim() &&
              (await updateDoc(doc(db, "users", activeUser?.uid), {
                uid: activeUser.uid,
                groupName: userName,
                participants: [...getUserFromUid(activeUser.uid,users)?.participants],
                avatar: url, //random array dp generator
                createdAt: activeUser.createdAt,
                creatorUid: activeUser.creatorUid,
                unseenMessageCount: activeUser?.unseenMessageCount
              }));

            if (activeUser?.name) {
              await updateDoc(doc(db, "users", activeUser?.uid), {
                uid: activeUser.uid,
                name: userName,
                email: activeUser.email,
                avatar: url,
                createdAt: activeUser.createdAt,
                unseenMessageCount: activeUser?.unseenMessageCount
              });
            }
            setActiveUser({...activeUser,["avatar"]:url})
          });
        }
      );
    }

    setImg(null);
    setImgUrl("");
    // setUserName("");
    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
  };

  return (
    <div className="userProfile">
      <div className="d-flex justify-content-center">
        <label htmlFor="profilePicture">
          {img ? (
            <img
              className="large"
              src={URL.createObjectURL(img)}
            />
          ) : (
            <img
              className="large"
              src={activeUser?.avatar || IMAGES.default}
              alt="Avatar"
            />
          )}
          {/* https://api.backlinko.com/app/uploads/2021/03/whatsapp-user-statistics.webp */}
          {/* <img className="avatar" src={activeUser?.avatar || IMAGES.default} alt="Avatar" /> */}
        </label>
        <input
          id="profilePicture"
          style={{ display: "contents" }}
          type="file"
          onChange={handleDpChange}
          accept="image/*"
        />
      </div>
      <>
        <div className="d-flex justify-content-center">
          <input
            id="newName"
            className="textInput"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            type="text"
            placeholder="Name..."
            // onKeyDown={(e) => handleEnter(e)}
          />
        </div>
        <div className="d-flex justify-content-center">
          <button className="arrow"
            onClick={() => {
              (activeUser?.name !== userName ||
                activeUser?.groupName !== userName) &&
                handleNameChange();
              activeUser?.avatar !== img && handleUpload();
              // handleUpload()
              setEditProfile(false);
            }}
          >
            Edit
          </button>
        </div>
      </>
    </div>
  );
}

export default UserProfile;
