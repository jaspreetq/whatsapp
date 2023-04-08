import React, { useState } from "react";
import { rightArrow } from "../../Utillities/icons";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { getTime } from "../../Utillities/getTime";

function SelectParticipants(props) {
  const actualDbGroupId = "";
  const { users, selectedParticipants, setSelectedParticipants } = props;
  const createNewGroupId = () => {
    return `${auth.currentUser.uid}/${getTime()}`;
  };
  //   const userCheckboxChange = (e, checkedUser) => {};
  const updateChatGroup = async () => {
    //GET DOC
    const docRef = await getDoc(
      doc(db, "chatGroups", actualDbGroupId || "SFDA23")
    );
    if (docRef?.exists()) {
      await updateDoc(doc(db, "chatGroups", actualDbGroupId || RANDOM_TEXT), {
        message: arrayUnion({
          uid: auth.currentUser.id,
          name: activeUser?.name,
          avatar: activeUser.photoURL,
          createdAt: new Date().toUTCString(),
          img: img && url,
          fileName: imgName ? imgName : "",
          time: getTime(),
        }),
      });
    }
    //TRUE UPDATE
    //FALSE SETDOC
  };
  return (
    <div>
      <div>
        {users?.map((user) => {
          return (
            <div key={user.uid}>
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
            </div>
          );
        })}
      </div>
      <button onClick={updateChatGroup}>{rightArrow}</button>
    </div>
  );
}

export default SelectParticipants;
