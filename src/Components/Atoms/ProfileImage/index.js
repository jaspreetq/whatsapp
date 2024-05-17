import React, {useEffect, useState} from "react";
import {IMAGES} from "../../Utillities/Images";
import {auth, db, storage} from "../../../firebase";
import {doc, updateDoc} from "firebase/firestore";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";

function ProfileImage({
  activeUser,
  propObj: {
    img,
    setImg,
    imgName,
    setImgName,
    fileStatus,
    setFileStatus,
    imgUrl,
    setImgUrl,
  },
}) {
  const [userName, setUserName] = useState(
    activeUser?.name || activeUser?.groupName || "",
  );

  let imgURL;

  function handleDpChange(e) {
    setImg(e.target.files[0]);
    setImgName(e.target.files[0].name);
    setFileStatus(true);
    e.target.value = null;
  }

  return (
    <div className="userProfile">
      <div className="d-flex justify-content-center">
        <label htmlFor="profilePicture">
          {img ? (
            <img
              className="large"
              id="large"
              key="large"
              src={URL.createObjectURL(img)}
            />
          ) : (
            <img
              className="large"
              id="large2"
              key="large2"
              src={activeUser?.avatar || IMAGES.GROUP_DEFAULT_DP}
              alt="Avatar"
            />
          )}
        </label>
        <input
          id="profilePicture"
          style={{display: "contents"}}
          type="file"
          onChange={handleDpChange}
          accept="image/*"
        />
      </div>
    </div>
  );
}

export default ProfileImage;
