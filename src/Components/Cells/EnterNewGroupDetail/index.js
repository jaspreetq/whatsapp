// import { doc, serverTimestamp, setDoc } from "firebase/firestore";
// import React, { useContext, useState } from "react";
// import { auth, db } from "../../../firebase";
// import { IMAGES } from "../../Utillities/Images";
// import { getTime } from "../../Utillities/getTime";
// import { messageContext } from "../../../App";
// import { rightArrow } from "../../Utillities/icons";

// function EnterNewGroupDetail(props) {
//   console.log("group partlength: ", selectedParticipants);

//     // const docRef = await getDoc(
//     //   doc(db, "chatGroups", actualDbGroupId || "SFDA23")
//     // );
//     // if (docRef?.exists()) {
//     //   await updateDoc(doc(db, "chatGroups", actualDbGroupId || RANDOM_TEXT), {
//     //     participants: arrayUnion(...selectedParticipants),
//     //     // message: arrayUnion({
//     //     //   uid: auth.currentUser.id,
//     //     //   name: activeUser?.name,
//     //     //   avatar: activeUser?.photoURL,
//     //     //   createdAt: new Date().toUTCString(),
//     //     //   img: img && url,
//     //     //   fileName: imgName ? imgName : "",
//     //     //   time: getTime(),
//     //     // }),
//     //   });
//     // }
//   };

//   return (
//     <>
//       <div>
//         <input
//           className="textInput"
//           type="text"
//           value={groupName}
//           onChange={(e) => {
//             setGroupName(e.target.value);
//           }}
//           placeholder="Enter group name..."
//         />
//       </div>
//       <p className="text-danger">{errorName}</p>
//       <div>
//         <button
//           onClick={() => {
//             !groupName
//               ? setErrorName("Please enter group name.")
//               : isNewGroupBtnClicked && createChatGroup();
//           }}
//         >
//           {rightArrow}
//         </button>
//       </div>
//     </>
//   );
// }

// export default EnterNewGroupDetail;
