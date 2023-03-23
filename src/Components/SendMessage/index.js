import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react'
import { auth, db } from '../../firebase';

function SendMessage() {
    const [message, setMessage] = useState("");
    // const handleSend = () => { setMessage("") };
    const handleEnter = (e) => (e.key == "Enter") && handleSend();

    const handleSend = async (event) => {
        if (message.trim() === "") {
          alert("Enter valid message");
          return;
        }
        const { uid, displayName, photoURL } = auth.currentUser;
        await addDoc(collection(db, "messages"), {
          text: message,
          name: displayName,
          avatar: photoURL,
          createdAt: serverTimestamp(),
          uid,
        });
        setMessage("");
      };
      
    //   return (
    //     <form onSubmit={(event) => sendMessage(event)} className="send-message">
    return (
        <div style={{ width: "98%" }}>
            <input
                id="newMessage"
                value={message}
                onChange={(e) => { setMessage(e.target.value) }}
                type="text" placeholder='Send Message...'
                onKeyDown={handleEnter}
            />            
            <button onClick={(e)=>handleSend(e)}>Send</button>
        </div>
    )
}

export default SendMessage