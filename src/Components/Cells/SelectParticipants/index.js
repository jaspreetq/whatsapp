import React, { useContext, useState } from "react";
import { rightArrow } from "../../Utillities/icons";
import { messageContext } from "../../../App";
import { auth, db } from "../../../firebase";
import { getTime } from "../../Utillities/getTime";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { IMAGES } from "../../Utillities/Images";

function SelectParticipants(props) {
  const {
    users,
    selectedParticipants,
    setSelectedParticipants,
    isNewGroupBtnClicked,
    setIsNewGroupBtnClicked,
    showGroupAddComp,
    setShowGroupAddComp,
  } = props;

  const {
    actualDbGroupId,
    setActualDbGroupId,
    actualDbId,
    setActualDbId,
    activeUser,
  } = useContext(messageContext);

  const [groupEmptyError, setGroupEmptyError] = useState("");
  const [errorName, setErrorName] = useState("");

  const [groupName, setGroupName] = useState("");
  const createNewGroupId = () => {
    return `${auth.currentUser.uid}${getTime()}`;
  };

  //   const userCheckboxChange = (e, checkedUser) => {};
  const createChatGroup = async () => {
    //GET DOC
    //TRUE UPDATE
    //FALSE SETDOC

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
      messages: [{}],
    });
    //create new
    setActualDbGroupId(gid);
    setActualDbId(gid);
    setIsNewGroupBtnClicked(true);
  };

  return (
    <div>
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
      <div>
        {users?.map((user) => {
          return (
            <div key={user.uid}>
              {!user?.groupName && (
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
              : createChatGroup();
          }}
        >
          {rightArrow}
        </button>
      </div>
    </div>
  );
}

export default SelectParticipants;
