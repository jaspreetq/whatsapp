// import React from 'react'

// function CustomModal() {
//   return (
//     <>title
//     {show && <div className='modalData' >
//                 <div className='modalContent' >
//                     {showHead && <div className="Modal-Header">
//                         <label className="Modal-Title">{title}</label>
//                     </div>}
//                     {/* Body */}
//                     <div className="Modal-Body">
//                         {children}
//                     </div>
//                     {/* Footer */}
//                     {showFoot && <div className="Modal-Footer">
//                         <button className="btnClose" onClick={() => {
//                             setShow(false)
//                             setSelectedList && setSelectedList([])
//                             setEditedGroupName && setEditedGroupName("")
//                             dispatch({ type: "MEMBERSADDEDSTATUS", payload: false })
                           
//                         }}>
//                             Close
//                         </button>
//                         {selectedList?.length || channelName || editedGroupName ? <button className='btnProceed' onClick={() => {
//                             addChannel && addChannel()
//                             data?.groupId &&  addUser()
//                             handleSelect()
//                             setShow && setShow(false)
//                             handleEditGroupName && handleEditGroupName()
//                             handleGroupNameEdit && handleGroupNameEdit()
//                             dispatch({ type: "MEMBERSADDEDSTATUS", payload: false })
                          
//                         }} >Add</button> : null}
//                             {console.log(string==true,string==false,addUser,handleSelect,"addchannel")}

//                     </div>}
//                 </div>
//             </div>}
//             </>
//   )
// }

// export default CustomModal
