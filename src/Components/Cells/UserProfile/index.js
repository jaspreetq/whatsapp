import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useContext, useState } from 'react'
import { auth, db, storage } from "../../../firebase";
import { FileContext } from '../../LiveChat';
import { rightArrow } from '../../Utillities/icons';
import { IMAGES } from '../../Utillities/Images'

function UserProfile({ activeUser, setEditProfile, isGroup = false }) {
    const [userName, setUserName] = useState(activeUser?.name || activeUser?.groupName)
    const [img, setImg] = useState("")
    const [imgName, setImgName] = useState("")
    const [fileStatus, setFileStatus] = useState(false)
    const [imgUrl, setImgUrl] = useState("")
    let imgURL;
    function handleDpChange(e) {
        // setFileStatus(true)
        setImg(null)

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
        activeUser?.groupName && userName?.trim() && await updateDoc(doc(db, "users", activeUser?.uid), {
            uid: activeUser.uid,
            groupName: userName,
            participants: activeUser?.participants,
            avatar: activeUser.avatar, //random array dp generator
            createdAt: activeUser.createdAt,
            creatorUid: activeUser.creatorUid,
            lastMessage: "",
            lastMessageDate: ""
        })

        activeUser?.name && userName?.trim() && await updateDoc(doc(db, "users", activeUser?.uid), {
            uid: activeUser.uid,
            name: userName,
            email: activeUser.email,
            avatar: activeUser.avatar, //random array dp generator
            createdAt: activeUser.createdAt,
            lastMessage: "",
            lastMessageDate: ""
        })
    }

    const handleUpload = async () => {
        setFileStatus(false)

        if (img) {
            console.log("imgimgin", img)
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
                        activeUser?.groupName && userName?.trim() && await updateDoc(doc(db, "users", activeUser?.uid), {
                            uid: activeUser.uid,
                            groupName: userName,
                            participants: activeUser?.participants,
                            avatar: url, //random array dp generator
                            createdAt: activeUser.createdAt,
                            creatorUid: activeUser.creatorUid,
                            lastMessage: "",
                            lastMessageDate: ""
                        })

                        activeUser?.name && await updateDoc(doc(db, "users", activeUser?.uid), {
                            uid: activeUser.uid,
                            name: userName,
                            email: activeUser.email,
                            avatar: url,
                            createdAt: activeUser.createdAt,
                            lastMessage: "",
                            lastMessageDate: ""
                        })
                    });
                }
            );
        }

        setImg(null);
        setImgUrl("")
        // setUserName("");
        // progress can be paused and resumed. It also exposes progress updates.
        // Receives the storage reference and the file to upload.
    };

    return (
        <div>
            <div className='h-100'>

                <label htmlFor="profilePicture">
                    {img ?
                        <img className="avatar" src={URL.createObjectURL(img)} width="50%" height="80%" />
                        : <img className="avatar" src={activeUser?.avatar || IMAGES.default} alt="Avatar" />}
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
                <div>
                    <input
                        id="newName"
                        className='textInput'
                        value={userName}
                        onChange={(e) => {
                            setUserName(e.target.value);
                        }}
                        type="text"
                        placeholder="Name..."
                    // onKeyDown={(e) => handleEnter(e)}
                    />

                </div>
                <button onClick={() => {
                    ((activeUser?.name !== userName) || (activeUser?.groupName !== userName)) && handleNameChange()
                    activeUser?.avatar !== img && handleUpload()
                    // handleUpload()
                    setEditProfile(false)
                }}>
                    {rightArrow}
                </button>
            </>
        </div>
    )
}

export default UserProfile