import React, { useContext, useEffect, useRef, useState } from "react";
import { rightArrow } from "../../Utillities/icons";
import { messageContext } from "../../../App";
import { auth, db, storage } from "../../../firebase";
import { getTime } from "../../Utillities/getTime";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { IMAGES } from "../../Utillities/Images";
import { getUserFromUid } from "../../Utillities/getUserFromUid";
import "./styles.css";
import ProfileImage from "../../Atoms/ProfileImage";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

function SelectParticipants(props) {
  const [img, setImg] = useState("");
  const [imgName, setImgName] = useState("");
  const [fileStatus, setFileStatus] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const propObj = {
    img, setImg,
    imgName, setImgName,
    fileStatus, setFileStatus,
    imgUrl, setImgUrl
  }
  let imgURLGlobal;
  const imgURL = useRef();
  const {
    users,
    selectedParticipants,
    setSelectedParticipants,
    isNewGroupBtnClicked,
    setIsNewGroupBtnClicked,
    showGroupAddComp,
    setShowGroupAddComp,
    isNewGroup,
    groupName,
    setGroupName,
  } = props;
  
  const {
    actualDbGroupId,
    setActualDbGroupId,
    actualDbId,
    setActualDbId,
    activeUser,
    recieverDetails,
    setRecieverDetails,
    messages,
    setMessages,
    welcomeChatPage,
    setWelcomeChatPage,
    showMemberEditFormOnTheRight, setShowMemberEditFormOnTheRight
  } = useContext(messageContext);

  const [userName, setUserName] = useState(
    recieverDetails?.name || recieverDetails?.groupName
  );
  const grp = users?.find((user) => user.uid == actualDbId);
  const [localGroupName, setLocalGroupName] = useState(getUserFromUid(recieverDetails?.uid, users)?.groupName);
  
  const [groupEmptyError, setGroupEmptyError] = useState("");
  const [errorName, setErrorName] = useState("");

  useEffect(()=>{
    if(showGroupAddComp && !showMemberEditFormOnTheRight){
      setLocalGroupName("");
      setRecieverDetails({});
      setSelectedParticipants([])
    }
    return ()=>setRecieverDetails(getUserFromUid(actualDbId,users));
  },[])
  useEffect(() => {
    if (!isNewGroup && recieverDetails?.uid !== grp?.uid) {
      setIsNewGroupBtnClicked(true);
      // setSelectedParticipants([{}]);
      setShowGroupAddComp(false);
    }
  }, [recieverDetails?.uid]);

  const currentUser0 = users?.find((user) => user.uid == auth.currentUser.uid);

  const createNewGroupId = () => {
    return `${auth.currentUser.uid}${getTime()}${users?.length}`;
  };

  const updateChatGroup = async () => {
    console.log(imgURL,"ref inside chatgrop")
    //GET DOC
    //TRUE UPDATE
    //FALSE SETDOC

    const gid = recieverDetails?.uid; //grp

    const currentUser0 = users?.find(
      (user) => user.uid == auth.currentUser.uid
    );
    const tempSelectedParticipants = [...selectedParticipants];

    await updateDoc(doc(db, "users", gid), {
      uid: gid,
      // creatorUid:
      groupName: localGroupName,
      avatar: imgURL.current || recieverDetails?.avatar || IMAGES.GROUP_DEFAULT_DP, //random array dp generator
      createdAt: serverTimestamp(),
      participants: [...tempSelectedParticipants],
      // details: {uid,email,name,avatar,}
    });
    // await get
    let docRef = await getDoc(doc(db, "chats", gid));

    await updateDoc(doc(db, "chats", gid), {
      uid: gid,
      creatorUid: auth.currentUser.uid,
      //   creator :activeUser,
      createdAt: serverTimestamp(),
      participants: [...tempSelectedParticipants],
      messages,
      lastChatedAt: serverTimestamp(),

    });

    setActualDbId(gid);
    setIsNewGroupBtnClicked(true);
    setShowGroupAddComp(false);
  };

  const handleUpload = async () => {
    console.log(img,"ref inside upload func")
    setFileStatus(false);
    
    if (img) {
      
      const localFileNewURL = `/profiles/${img.name}${recieverDetails.uid}`;
      const storageRef = ref(storage, localFileNewURL);
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.then(
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            setImgUrl(url);
            imgURLGlobal = url;
            // const obj = {a: 23}
            setRecieverDetails((rec)=>{
              return {...rec,["avatar"]:url}
            })
            console.log(url, "url :: 12", userName);
            imgURL.current = url;
            isNewGroup ? createChatGroup(): updateChatGroup();
          });
        }
      );
    }
    setImg(null);
    !img && isNewGroup ? createChatGroup(): updateChatGroup();
    
    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
  };
 
  const createChatGroup = async () => {
    //GET DOC
    //TRUE UPDATE
    //FALSE SETDOC
    
    const gid = createNewGroupId();
    // selectedParticipants?.filter((member,idx)=>member?.uid&&member)
    const tempSelectedParticipants = [...selectedParticipants];
    tempSelectedParticipants[0] = currentUser0;
 
    await setDoc(doc(db, "users", gid), {
      uid: gid,
      groupName: localGroupName,
      creatorUid: auth.currentUser.uid,
      avatar: imgURLGlobal|| recieverDetails?.avatar || IMAGES.GROUP_DEFAULT_DP,
      createdAt: serverTimestamp(),
      participants: [...tempSelectedParticipants],
 
    });

    await setDoc(doc(db, "chats", gid), {
      uid: gid,
      creatorUid: auth.currentUser.uid,
      //   creator :activeUser,
      createdAt: serverTimestamp(),
      participants: [...tempSelectedParticipants],
      messages: [{}],
      lastChatedAt: serverTimestamp(),
    });
    //create new
    // setActualDbGroupId(gid);
    setActualDbId(gid);
    setIsNewGroupBtnClicked(true);
    setShowGroupAddComp(false);

  };

  return (
    <div className="padded" style={{ padding: "15px" }}>
      <ProfileImage activeUser={isNewGroup ? {} :recieverDetails} propObj={propObj} />
      <div>
        <input
          className="textInput"
          type="text"
          value={localGroupName}
          onChange={(e) => {
            return setLocalGroupName(e.target.value);
          }}
          //setgrpname
          placeholder="Enter group name..."
        />
      </div>
      <div className="">
        <br />
        <h6 className="text-primary">
          {isNewGroup
            ? "Select group participants"
            : "Add/Remove group participants"}
        </h6>
        {users?.map((user) => {
          const avatar1 = user?.avatar;
          return (
            <div key={user.uid}>
              {!user?.groupName && user?.uid !== currentUser0?.uid && (
                <label>
                  <input
                    name={user?.uid}
                    style={{ height: "15px", width: "15px" }}
                    type="checkbox"
                    checked={selectedParticipants?.some(
                      (participant) => participant.uid === user.uid
                    )}
                    onChange={(e) => {
                      // console.log("IN check change", e.target.checked);
                      if (e.target.checked)
                        setSelectedParticipants(() => [
                          ...selectedParticipants,
                          user,
                        ]);
                      else
                        setSelectedParticipants(() =>
                          selectedParticipants?.filter(
                            (participant) => participant.uid !== user?.uid
                          )
                        );
                    }}
                  />
                  {/* style={{ backgroundImage :`url(${user?.avatar})`}} */}
                  <span>
                    {" "}
                    <img height="50" width="50" className="avatar" id={user?.uid} key={user?.uid} src={user?.avatar} /> {user?.name} 
                  </span>
                </label>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-danger">{errorName}</p>
      <div>
        <button
          className="arrow"
          onClick={() => {
            !localGroupName
              ? setErrorName("Please enter group name.")
              : handleUpload()
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default SelectParticipants;