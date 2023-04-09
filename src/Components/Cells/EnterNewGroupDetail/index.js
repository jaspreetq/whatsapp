import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { auth, db } from "../../../firebase";
import { IMAGES } from "../../Utillities/Images";
import { getTime } from "../../Utillities/getTime";
import { messageContext } from "../../../App";
import { rightArrow } from "../../Utillities/icons";

function EnterNewGroupDetail(props) {
  const { actualDbGroupId, setActualDbGroupId, actualDbId, setActualDbId } =
    useContext(messageContext);
  const [errorName, setErrorName] = useState("");
  const {
    selectedParticipants,
    isNewGroupBtnClicked,
    setIsNewGroupBtnClicked,
    showGroupAddComp,
    setShowGroupAddComp,
  } = props;
  console.log("group partlength: ", selectedParticipants);
  const [groupName, setGroupName] = useState("");
  const createNewGroupId = () => {
    return `${auth.currentUser.uid}${getTime()}`;
  };

  //   const userCheckboxChange = (e, checkedUser) => {};
  const createChatGroup = async () => {
    //GET DOC
    //TRUE UPDATE
    //FALSE SETDOC

    try {
      if (!actualDbGroupId) {
        const gid = createNewGroupId();
        console.log("gid", gid);
        await setDoc(doc(db, "users", gid), {
          uid: gid,
          groupName,
          avatar: IMAGES.DP1, //random array dp generator
          createdAt: serverTimestamp(),
          participants: selectedParticipants,
          // details: {uid,email,name,avatar,}
        });

        await setDoc(doc(db, "chats", gid), {
          uid: gid,
          creatorUid: auth.currentUser.uid,
          //   creator :activeUser,
          createdAt: serverTimestamp(),
          participants: selectedParticipants,
          messages: [],
        });
        //create new
        setActualDbGroupId(gid);
        setActualDbId(gid);
        setIsNewGroupBtnClicked(false);
        showGroupAddComp(false);
      }
    } catch (error) {
      console.log(error);
    }

    // const docRef = await getDoc(
    //   doc(db, "chatGroups", actualDbGroupId || "SFDA23")
    // );
    // if (docRef?.exists()) {
    //   await updateDoc(doc(db, "chatGroups", actualDbGroupId || RANDOM_TEXT), {
    //     participants: arrayUnion(...selectedParticipants),
    //     // message: arrayUnion({
    //     //   uid: auth.currentUser.id,
    //     //   name: activeUser?.name,
    //     //   avatar: activeUser.photoURL,
    //     //   createdAt: new Date().toUTCString(),
    //     //   img: img && url,
    //     //   fileName: imgName ? imgName : "",
    //     //   time: getTime(),
    //     // }),
    //   });
    // }
  };

  return (
    <>
      <div>
        <input
          className="textInput"
          type="text"
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value);
          }}
          placeholder="Enter group name..."
        />
      </div>
      <p className="text-danger">{errorName}</p>
      <div>
        <button
          onClick={() => {
            !groupName
              ? setErrorName("Please enter group name.")
              : isNewGroupBtnClicked && createChatGroup();
          }}
        >
          {rightArrow}
        </button>
      </div>
    </>
  );
}

export default EnterNewGroupDetail;
