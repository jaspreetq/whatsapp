// import React from 'react'

// function Chat() {

//   useEffect(() => {
//     const messageList = [];
//     Object.keys(receiverDetails).length && setWelcomeChatPage(false);

//     console.log(
//       "actualDbId in useEffect(LiveCHat) b4: test>>>>>>>>>",
//       receiverDetails,
//       actualDbId
//     );

    
//     const unsubscribe = onSnapshot(
//       doc(db, "chats", actualDbId || "mLhwciwWGdy6WKbOlnrZ"),
//       (doc) => {
//         // doc?.exists() && setMessages(doc.data()?.messages);
//         console.log(doc.data()?.messages, "doc.data()?.messages")
//         doc?.exists() && setMessages(doc.data()?.messages);
//         console.log("doc on snapshot data :", doc.data()?.messages, actualDbId);
//         console.log("actualDbId in useEffect(LiveCHat) :", actualDbId);
//         //setWelcomeChatPage(true);
//       }
//     );
//     console.log("receiverDetails ", receiverDetails);
//     unsubscribe();
//   }, [receiverDetails?.name]);

//   return (
//     <div>
//     {welcomeChatPage ? (
//       <div className="align-middle w-100 h-50"> Select a contact to chat</div>
//     ) : (
//       <div>
//         <>
//           {receiverDetails.name}
//           <ul>
//             {messages?.map((message) => {
//               console.log("message:::", message);
//               const cssStr =
//                 message.uid == receiverDetails.uid
//                   ? "-receiver"
//                   : "-sender";
//               console.log("cssStr: ", cssStr);
//               return (
//                 <div className={`container${cssStr}`} key={message.uid}>
//                   <p>{message.text}</p>
//                   <span className="time-right">
//                     {new Date(message?.createdAt).getHours() +
//                       ":" +
//                       new Date(message?.createdAt).getMinutes()}
//                   </span>
//                 </div>
//               );
//             })}
//           </ul>

//           <SendMessage />
//         </>
//       </div>
//     )}
//   </div>
//   )
// }

// export default Chat