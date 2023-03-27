import React, { useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import "./styles.css";
import { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import SendMessage from "../Cells/SendMessage";
import SignOut from "../Atoms/SignOut";
import { messageContext } from "../../App";

function LiveChat() {
  const [chat] = useAuthState(auth);
  const { setErrorMessage } = useContext(messageContext);
  setErrorMessage("");

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt"),
      limit(50)
    );
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let messages = [];
      console.log("<>snapshot   <>", QuerySnapshot);

      QuerySnapshot.forEach((doc) => {
        console.log("<>snapshot foreach<>", doc, doc.id, typeof doc);
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    return () => unsubscribe;
  }, []);

  return (
    //RecieveChat
    <div className="liveChat">
      <ul>
        {messages?.map((message) => (
          <li>{message.text}</li>
        ))}
      </ul>
      <SignOut />
      <div className="container">
        <img
          src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIQEBUPEBAWFhUVEBUVGRgXFhUXFRcVFRcXFhUVFhcYHSggGB0lGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGyslHyUtLS0rLS0tLS0vLS0tLSs3LS0tLS0tLS0tLS0rLS0tLS0tLS0tLSstNy0tLS0tLS0rN//AABEIALcBEwMBIgACEQEDEQH/xAAcAAEBAAIDAQEAAAAAAAAAAAAAAQQFAwYHAgj/xAA/EAACAQIEAwUFBQYEBwAAAAAAAQIDEQQSITEFQVEGImFxkQcTgaGxMsHR4fAUI0JScoIVYqKyJDNEU5LC8f/EABkBAQADAQEAAAAAAAAAAAAAAAABAgMEBf/EACMRAQACAgMAAgIDAQAAAAAAAAABAgMREiExE0EyYQQjUSL/2gAMAwEAAhEDEQA/APaEUIAACAUEAFAAAAAAAAIUgAAAQHDjMXTowdSrUjCK3cmkvmdL4z7TKFO6w9KVZ7Xfch81mfoRMxCYiZd6IeR4j2kY6XehCjBdMkpP1cvuOJe0jHReroyXjSkvpMrzhb45ewg824Z7U03bE4dJfzU5f+kvxO7cH49hsWr0K0ZO13Haa84PVeZaJiVZrMNkACUAAAgACQgAAAAD5Z9EYHxYH0AhkAEAAAAAAKAAAAAAAAQpAB0rtR27jRboYRKpVWjlvTg/h9t/L6GD7S+0sof8FRla6/eSTs7PammttNX5rqdPweCUUm97bGWTJpvixcjF++xT95iKs5z8Xov6UtIryRiLBtckltY2c4t6oqpPmcs5XZXA08qdtLepxThflY3tXD3RwfsWjK/Iv8LRugno1+v1YlODjJShJpx1Ti7Si+qa1TNvPCJGPUoqJpXKztgdp7N+0SrSapY1OpDZVYpe8S5Z1tPzWvmemYLGU68FVozU4SWji7r8n4HgkqKkvH6mV2X7QVuH17q7ptpThfSS6ro+jN65HJfFp7wDiwuIjVhGpB3jKKkn1TOQ2YgAAgBCAAAApAAAKBzEDBKAAAACgAAAAAAAADgxuJjSpzqy2hByfwV7HOdf7Z1f3CorepKz/pj3n88q+JEzqExG5eXXdWvOvVd25OTvzk9fQ5lUu/Nn3iaeV2W2xxWscGSdy9TFXUMvDU7mfTwyJwqCZu5YVWuila7a2tppnQ8L3Zj4mkt0bucImPVprwImqYs6zUhqYOIVzsWNpRvoaTGUuZELT41E52e591GqiT57P8zirR1OPCvv5b8m/TV/K50VcuSHrPszxzlQlh5X7jvG/wDLLdeuv9x3M837D1fd1actLT7j/u2fqkekHXWenn3jsABZVCMoIEIUgApABQABzAAlAAABSFAAAAAigQFAEOudo43qp8o0v90nf/ajfYrEwpQdSpJRitW2arG1IVLVINShOnG0lqnqytlq+7ee8ZptPbTV3+71ualSudm47QumkurNBhMPmdmcGT16uLxseGU31Ow0ZPLY1WBpKOjsbimo23IotdjtmPU0uzMnTSkkc1WlFRd+hPHavLTrWKZpcZUsjsuJoxersdd4io7ablIjtrvpqJLQxaK/ep9L/FWaa+ZlYjRHDwum5VdOVvhdo2qwv4712bVoq388H5bSv89j09nRuBYOMciWkVG8n435t+CXlY3XAe12Gx1SdOg5NQk4qbSUKjWr9273a57arU669Q868blvgAXUCFIQIQpAIUgAoIAMgAEoAABQAAAKAAAAAAdG9pfEZx/Z8NTm4udXPNq2tOC1i78m2Ts5RcKE4bd5yiuiaXLzV/iYntFpJYqFV/w4ZxXnKpv6JnF2K4hOrOtSm75FFxfg9Mr13Vjl5f26d8Uj4ImHx2kxjpUHUjByk1lSSdsz/mty0PO3Sxsm5tTv0V0k+luh6NxzGxprJbeTk77L9PU6NxntTWhPJQpuSW8owc1foraLzZXfeohOutzLVYnGcQo9/LUiutvT9O5zYPtZir9+7fO6s2lz/Iwsf2rxfehKootSjHWKcJJqUnLOo2VrJW538DPhXr05xhWhTnmhGacbbSSeV8lLW1tH0uaTE67iGdZjfUy7rwjirqQU76211PnjfF5KGnLlrtz1MDglNOUUrxTMfjjy1FT3bdjl327tdOr8V41iaj7rllTdrc1cwcLw7GVneMZ26ybsbSEqletHD0ZRgnOzqTajCO1229FZST5vVaczT1cViYydNTndVKkXJxnkeVpRcJKTvfVvZLTe511iddacF9cu5mWbLs/io99yytc7/kztPZOhKdCcpw/ewlGLa2cG75vPQ6pDieNpzytTnC9r2bTXVX7y+J2Tg3EnmlTatGtFRlrZpXuV3O+9L8Y11t3jFyX+GYqWfKnh5wUv6045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"
          alt="Avatar"
          style={{ width: "100%" }}
        />
        <p>Hello. How are you today?</p>
        <span className="time-right">11:00</span>
      </div>
      {/* src/Assets/dp1.jpeg */}
      <div className="container darker">
        <img
          src="https://img.freepik.com/free-photo/close-up-young-successful-man-smiling-camera-standing-casual-outfit-against-blue-background_1258-66609.jpg?w=2000"
          alt="Avatar"
          className="right"
          style={{ width: "100%" }}
        />
        <p>fine. Thanks for asking!</p>
        <span className="time-left">11:01</span>
      </div>
      <SendMessage />
    </div>
  );
}

export default LiveChat;
