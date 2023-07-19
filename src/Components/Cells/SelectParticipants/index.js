import React, {useContext, useEffect, useRef, useState} from "react";
import {rightArrow} from "../../Utillities/icons";
import {messageContext} from "../../../App";
import {auth, db, storage} from "../../../firebase";
import {getTime} from "../../Utillities/getTime";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {IMAGES} from "../../Utillities/Images";
import {getUserFromUid} from "../../Utillities/getUserFromUid";
import "./styles.css";
import ProfileImage from "../../Atoms/ProfileImage";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import getActiveUserId from "../../Utillities/getActiveUserId";

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
  const newObj = {};
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
  } = useContext(messageContext);

  const [userName, setUserName] = useState(
    recieverDetails?.name || recieverDetails?.groupName
  );
  const grp = users?.find((user) => user.uid == actualDbId);
  const [localGroupName, setLocalGroupName] = useState(isNewGroup ? "" : getUserFromUid(recieverDetails?.uid, users)?.groupName);
  // const { groupName, setGroupName } = useContext(GrpParticipantContext);
  const [groupEmptyError, setGroupEmptyError] = useState("");
  const [errorName, setErrorName] = useState("");

  useEffect(() => {
    isNewGroup && setSelectedParticipants([activeUser || getUserFromUid(getActiveUserId(), users)])
  }, [])
  //
  // useEffect(()=>{
  //   const q = query(collection(db, "users"), orderBy("createdAt"));
  //   const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
  //     QuerySnapshot.forEach((doc) => {
  //
  //     });
  //   });
  //   return () => unsubscribe;
  // },[])

  // useEffect(()=>{
  //   if(showGroupAddComp && !showMemberEditFormOnTheRight){
  //     setLocalGroupName("");
  //     setRecieverDetails({});
  //     setSelectedParticipants([])
  //   }
  //   return ()=>setRecieverDetails(getUserFromUid(actualDbId,users));
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

  const updateChatGroup = async () => {
    //GET DOC
    //TRUE UPDATE
    //FALSE SETDOC

    // docRef = await getDoc(doc(db, "users", gid));
    // setRecieverDetails({...docRef.data()})
    // recieverDetails?.avatar !== img && handleUpload();  

    const gid = recieverDetails?.uid; //grp

    // selectedParticipants?.filter((member,idx)=>member?.uid&&member)
    const currentUser0 = users?.find(
      (user) => user.uid == auth.currentUser.uid
    );
    const tempSelectedParticipants = [...selectedParticipants];
    // tempSelectedParticipants[0] = currentUser0;
    await updateDoc(doc(db, "users", gid), {
      uid: gid,
      // creatorUid:
      groupName: localGroupName,
      avatar: imgURL.current || recieverDetails?.avatar || IMAGES.GROUP_DEFAULT_DP, //random array dp generator
      createdAt: serverTimestamp(),
      participants: [...tempSelectedParticipants],
      unseenMessageCount: recieverDetails?.unseenMessageCount
      // {...users?.map(user=>user.uid)}
      // details: {uid,email,name,avatar,}
    });
    // await get
    let docRef = await getDoc(doc(db, "chats", gid));
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

  const handleUpload = async () => {
    setFileStatus(false);

    if (img) {

      const localFileNewURL = `/profiles/${img.name}${recieverDetails?.uid}`;
      const storageRef = ref(storage, localFileNewURL);
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.then(
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            setImgUrl(url);
            imgURLGlobal = url;
            // const obj = {a: 23}
            setRecieverDetails((rec) => {
              return {...rec, ["avatar"]: url}
            })
            imgURL.current = url;
            isNewGroup ? createChatGroup() : updateChatGroup();
          });
        }
      );
    }
    setImg(null);
    !img && isNewGroup ? createChatGroup() : updateChatGroup();

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

    const objProxy = {};
    tempSelectedParticipants?.map(user => {return objProxy[user.uid] = 0})

    await setDoc(doc(db, "users", gid), {
      uid: gid,
      groupName: localGroupName,
      creatorUid: auth.currentUser.uid,
      avatar: imgURLGlobal || IMAGES.GROUP_DEFAULT_DP, //random array dp generator
      createdAt: serverTimestamp(),
      participants: [...tempSelectedParticipants],
      unseenMessageCount: objProxy
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
    // setWelcomeChatPage(true)
    // recieverDetails?.avatar !== img && handleUpload();
    // newObj = {};
  };

  return (
    <div className="padded" style={{padding: "15px"}}>
      <ProfileImage activeUser={isNewGroup ? {} : recieverDetails} propObj={propObj} />
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
                    style={{height: "15px", width: "15px"}}
                    type="checkbox"
                    checked={selectedParticipants?.some(
                      (participant) => participant.uid === user.uid
                    )}
                    onChange={(e) => {
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
                    <img height="50" width="50" id={user?.uid} className="avatar" key={user?.uid} src={user?.avatar} /> {user?.name}
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
