import React, { createContext, useState } from 'react'
import Header from '../Components/Atoms/Header';
import SelectParticipants from '../Components/Cells/SelectParticipants';
export const GrpParticipantContext = createContext();
function GrpParticipantContextDefination() {
  const [selectedParticipants, setSelectedParticipants] = useState([{}]);
  const [showGroupAddComp, setShowGroupAddComp] = useState(false);
  const [isNewGroupBtnClicked, setIsNewGroupBtnClicked] = useState(false);
  const [groupName, setGroupName] = useState("");

  return (
    <GrpParticipantContext.Provider value={{
      groupName, setGroupName
    }}>
      <Header
        title="Edit Group"
        goBack={() => setShowMemberEditFormOnTheRight(false)}
      />
      <br />
      {console.log(groupName, "groupName<><><>><<><><><><>><><")}
      <SelectParticipants users={users}
        selectedParticipants={recieverDetails?.participants}
        setSelectedParticipants={setSelectedParticipantsChat}
        isNewGroup={true}
        isNewGroupBtnClicked={isEditGrpBtnClicked}
        setIsNewGroupBtnClicked={setIsEditGrpBtnClicked}
        showGroupAddComp={showGroupAddComp}
        setShowGroupAddComp={setShowMemberEditFormOnTheRight}/>

    </GrpParticipantContext.Provider>
  )
}

export default GrpParticipantContextDefination