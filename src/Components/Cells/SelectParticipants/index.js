import React, { useContext, useState } from "react";
import { rightArrow } from "../../Utillities/icons";
import { messageContext } from "../../../App";
import { auth, db } from "../../../firebase";
import { getTime } from "../../Utillities/getTime";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { IMAGES } from "../../Utillities/Images";
import { GrpParticipantContext } from "../../../Context/GrpParticipantContextDefination";

function SelectParticipants(props) {
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
  // console.log(groupName,"groupName")
  const {
    actualDbGroupId,
    setActualDbGroupId,
    actualDbId,
    setActualDbId,
    activeUser,
    recieverDetails,
    setRecieverDetails,
  } = useContext(messageContext);
  // const { groupName, setGroupName } = useContext(GrpParticipantContext);

  const [groupEmptyError, setGroupEmptyError] = useState("");
  const [errorName, setErrorName] = useState("");
  const createNewGroupId = () => {
    return `${auth.currentUser.uid}${getTime()}${users?.length}`;
  };

  const updateChatGroup = async () => {
    //GET DOC
    //TRUE UPDATE
    //FALSE SETDOC
    const gid = recieverDetails?.uid;
    // selectedParticipants?.filter((member,idx)=>member?.uid&&member)
    const currentUser0 = users?.find(
      (user) => user.uid == auth.currentUser.uid
    );
    const tempSelectedParticipants = [...selectedParticipants];
    // tempSelectedParticipants[0] = currentUser0;
    console.log(tempSelectedParticipants, "tempSelectedParticipants :");
    console.log("gid", gid);
    await updateDoc(doc(db, "users", gid), {
      uid: gid,
      groupName,
      avatar: IMAGES.GROUP_DEFAULT_DP, //random array dp generator
      createdAt: serverTimestamp(),
      participants: tempSelectedParticipants,
      // details: {uid,email,name,avatar,}
    });

    await updateDoc(doc(db, "chats", gid), {
      uid: gid,
      creatorUid: auth.currentUser.uid,
      //   creator :activeUser,
      createdAt: serverTimestamp(),
      participants: tempSelectedParticipants,
      messages: [{}],
    });
    //create new
    // setActualDbGroupId(gid);
    setActualDbId(gid);
    setIsNewGroupBtnClicked(true);
    setSelectedParticipants([{}]);
    setShowGroupAddComp(false);
  };
  // const [recentGroupName,setRecentGroupName]
  //   const userCheckboxChange = (e, checkedUser) => {};
  const createChatGroup = async () => {
    //GET DOC
    //TRUE UPDATE
    //FALSE SETDOC
    const gid = createNewGroupId();
    // selectedParticipants?.filter((member,idx)=>member?.uid&&member)
    const currentUser0 = users?.find(
      (user) => user.uid == auth.currentUser.uid
    );
    const tempSelectedParticipants = [...selectedParticipants];
    tempSelectedParticipants[0] = currentUser0;
    console.log(tempSelectedParticipants, "tempSelectedParticipants :");
    console.log("gid", gid);
    await setDoc(doc(db, "users", gid), {
      uid: gid,
      groupName,
      avatar: IMAGES.GROUP_DEFAULT_DP, //random array dp generator
      createdAt: serverTimestamp(),
      participants: tempSelectedParticipants,
      // details: {uid,email,name,avatar,}
    });

    await setDoc(doc(db, "chats", gid), {
      uid: gid,
      creatorUid: auth.currentUser.uid,
      //   creator :activeUser,
      createdAt: serverTimestamp(),
      participants: tempSelectedParticipants,
      messages: [{}],
    });
    //create new
    // setActualDbGroupId(gid);
    setActualDbId(gid);
    setIsNewGroupBtnClicked(true);
    setSelectedParticipants([{}]);
    setShowGroupAddComp(false);
  };

  return (
    <div>
      <div>
        <input
          className="textInput"
          type="text"
          value={groupName}
          onChange={(e) => {
            return setGroupName(e.target.value);
          }}
          placeholder="Enter group name..."
        />
      </div>
      <div>
        <br />
        <h6 className="text-primary">
          {isNewGroup
            ? "Select group participants"
            : "Add/Remove group participants"}
        </h6>
        {users?.map((user) => {
          return (
            <div key={user.uid}>
              {!user?.groupName && user?.uid !== activeUser?.uid && (
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
                  {user?.name}
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
          onClick={() => {
            !groupName
              ? setErrorName("Please enter group name.")
              : isNewGroup
              ? createChatGroup()
              : updateChatGroup();
          }}
        >
          {rightArrow}
        </button>
      </div>
    </div>
  );
}

export default SelectParticipants;
