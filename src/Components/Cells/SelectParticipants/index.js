import React, { useContext, useEffect, useState } from "react";
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
  let imgURL;
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
  console.log(selectedParticipants, "groupName selectedParticipants");
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
  } = useContext(messageContext);

  const [userName, setUserName] = useState(
    recieverDetails?.name || recieverDetails?.groupName
  );
  const grp = users?.find((user) => user.uid == actualDbId);
  const [localGroupName, setLocalGroupName] = useState(getUserFromUid(recieverDetails?.uid, users)?.groupName);
  // const { groupName, setGroupName } = useContext(GrpParticipantContext);
  // console.log(localGroupName," localGroupName")
  const [groupEmptyError, setGroupEmptyError] = useState("");
  const [errorName, setErrorName] = useState("");

  useEffect(() => {
    setLocalGroupName(getUserFromUid(recieverDetails?.uid, users)?.groupName)
    // recieverDetails?.participants && setSelectedParticipants([...recieverDetails?.participants]);
  }, [])
  // useEffect(()=>{
  //   const q = query(collection(db, "users"), orderBy("createdAt"));
  //   const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
  //     QuerySnapshot.forEach((doc) => {
  //       // console.log("<>snapshot foreach<>", doc, doc.id, typeof doc);
  //     });
  //   });
  //   console.log("actualDbId in useEffectMount(sidebar) :", actualDbId);
  //   return () => unsubscribe;
  // },[])

  // useEffect(()=>{
  //   // setRecieverDetails(users?.at(-1));
  //   // setActualDbId(users?.at(-1)?.uid);
  //   setWelcomeChatPage(true)
  // },[users?.length])

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

  const handleUpload = async () => {
    setFileStatus(false);

    if (img) {
      
      const localFileNewURL = `/profiles/${img.name}${recieverDetails.uid}`;
      const storageRef = ref(storage, localFileNewURL);
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
       
    
       
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            setImgUrl(url);
            
            imgURL = url;
            console.log(url, imgURL, "url ::",recieverDetails?.groupName,userName);
            recieverDetails?.groupName &&
              // userName?.trim() &&
              // (await updateDoc(doc(db, "users", recieverDetails?.uid), {
              //   uid: recieverDetails.uid,
              //   groupName: recieverDetails?.groupName && userName,
              //   // name: recieverDetails?.name && userName,
              //   participants: [...recieverDetails?.participants],
              //   avatar: url, //random array dp generator
              //   createdAt: recieverDetails.createdAt,
              //   creatorUid: recieverDetails.creatorUid,
              // }));
              console.log(recieverDetails?.avatar,"?.avatar")
            if (recieverDetails?.name) {
              // await updateDoc(doc(db, "users", recieverDetails?.uid), {
              //   uid: recieverDetails.uid,
              //   name: userName,
              //   email: recieverDetails.email,
              //   avatar: url,
              //   createdAt: activeUser.createdAt,
              // });
            }
          });
        }
      );
    }
    setImg(null);
    // setImgUrl("");
    // setUserName("");
    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
  };
  const updateChatGroup = async () => {
    //GET DOC
    //TRUE UPDATE
    //FALSE SETDOC
    // console.log("imgimgin", recieverDetails);
    // docRef = await getDoc(doc(db, "users", gid));
    // console.log(docRef.data(),"docRef.data()")
    // setRecieverDetails({...docRef.data()})
    recieverDetails?.avatar !== img && handleUpload();  

    const gid = recieverDetails?.uid; //grp

    // selectedParticipants?.filter((member,idx)=>member?.uid&&member)
    const currentUser0 = users?.find(
      (user) => user.uid == auth.currentUser.uid
    );
    const tempSelectedParticipants = [...selectedParticipants];
    // tempSelectedParticipants[0] = currentUser0;
    console.log(imgURL,imgUrl, "tempSelectedParticipants :");
    console.log("gid", gid);
    await updateDoc(doc(db, "users", gid), {
      uid: gid,
      // creatorUid:
      groupName: localGroupName,
      avatar: imgUrl || recieverDetails?.avatar || IMAGES.GROUP_DEFAULT_DP, //random array dp generator
      createdAt: serverTimestamp(),
      participants: [...tempSelectedParticipants],
      // details: {uid,email,name,avatar,}
    });
    // await get
    let docRef = await getDoc(doc(db, "chats", gid));
    console.log("doesn't exist", actualDbId, docRef.exists());
    // if (docRef.exists()) return null;

    await updateDoc(doc(db, "chats", gid), {
      uid: gid,
      creatorUid: auth.currentUser.uid,
      //   creator :activeUser,
      createdAt: serverTimestamp(),
      participants: [...tempSelectedParticipants],
      messages,
      lastChatedAt: serverTimestamp(),

    });
    //create new
    // setActualDbGroupId(gid);
    setActualDbId(gid);
    setIsNewGroupBtnClicked(true);
    // setSelectedParticipants([{}]);
    setShowGroupAddComp(false);
    // setRecieverDetails()
  };
  // const [recentGroupName,setRecentGroupName]
  //   const userCheckboxChange = (e, checkedUser) => {};
  const createChatGroup = async () => {
    //GET DOC
    //TRUE UPDATE
    //FALSE SETDOC
    const gid = createNewGroupId();
    // selectedParticipants?.filter((member,idx)=>member?.uid&&member)
    const tempSelectedParticipants = [...selectedParticipants];
    tempSelectedParticipants[0] = currentUser0;
    console.log(tempSelectedParticipants, "tempSelectedParticipants :");
    console.log("gid", gid);
    await setDoc(doc(db, "users", gid), {
      uid: gid,
      groupName: localGroupName,
      creatorUid: auth.currentUser.uid,
      avatar: recieverDetails?.avatar|| IMAGES.GROUP_DEFAULT_DP, //random array dp generator
      createdAt: serverTimestamp(),
      participants: [...tempSelectedParticipants],
      // details: {uid,email,name,avatar,}
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
    // setSelectedParticipants([{}]);
    setShowGroupAddComp(false);
    // setGroupName("")
    // setRecieverDetails(getUserFromUid(gid,users))
    console.log("after create new grp : receiverdetails", recieverDetails);
    // setWelcomeChatPage(true)
    recieverDetails?.avatar !== img && handleUpload();
  };

  return (
    <div className="padded" style={{ padding: "15px" }}>
    <ProfileImage activeUser={recieverDetails} propObj={propObj}/>
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
                      console.log("IN check change", e.target.checked);
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
                  <span>
                    {" "}
                    <img className="avatar" key={user?.uid} src={user?.avatar} /> {user?.name}
                  </span>
                </label>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-danger">{errorName}</p>
      <div>
        {/* (selectedParticipants?.length < 1)?setGroupEmptyError("Select a member") */}
        <button
          className="arrow"
          onClick={() => {
            !localGroupName
              ? setErrorName("Please enter group name.")
              : isNewGroup
                ? createChatGroup()
                : updateChatGroup();
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default SelectParticipants;
