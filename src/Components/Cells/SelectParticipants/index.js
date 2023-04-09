import React, { useState } from "react";
import { rightArrow } from "../../Utillities/icons";

function SelectParticipants(props) {
  const actualDbGroupId = "";
  const {
    users,
    selectedParticipants,
    setSelectedParticipants,
    isNewGroupBtnClicked,
    setIsNewGroupBtnClicked,
  } = props;
  const [groupEmptyError, setGroupEmptyError] = useState("");
  return (
    <div>
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
      <p className="text-danger">{groupEmptyError}</p>
      <div>
        {/* (selectedParticipants?.length < 1)?setGroupEmptyError("Select a member") */}
        <button
          onClick={() => {
            if (!isNewGroupBtnClicked) {
              setIsNewGroupBtnClicked(true);
            }
          }}
        >
          {rightArrow}
        </button>
      </div>
    </div>
  );
}

export default SelectParticipants;
