import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { messageContext } from "../../App";
import { auth, db } from "../../firebase";

function SideBar() {
  
  // const dispatch = useDispatch();
  // const chatWith1 = useSelector(state => state.MessageReducer)
  const [users, setUsers] = useState([]);
  const {chatDisplay,message,setMessage,setChatDisplay,senderDetails,setSenderDetails} = useContext(messageContext);
  useEffect(() => {
    // console.log(setSenderDetails({abc:"ds"},senderDetails))
    //?
    // const qq = query()
    // console.log("docRef ",auth.currentUser.uid)
    const q = query(
      collection(db, "users"),
      orderBy("createdAt"),
      // limit(50),
      // auth?.currentUser?.uid && where("uid","==",onSnapshot?.currentUser?.uid),
    );
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let users = [];
      console.log("<>snapshot<>", QuerySnapshot);

      QuerySnapshot.forEach((doc) => {
        console.log("<>snapshot foreach<>", doc, doc.id, typeof doc);
        users.push({ ...doc.data(), id: doc.id });
        console.log("messages<>: ", users)
      });
      setUsers(users);
    });
    return () => unsubscribe;
  }, []);

  // const docRef = doc(db, "users");
  // const docSnap = (async () => await getDoc(docRef))();

  // if (docSnap.exists()) {
  //   console.log("Document data:", docSnap.data());
  // } else {
  //   // doc.data() will be undefined in this case
  //   console.log("No such document!");
  // }
  // console.log(users[], typeof users)
  const senderSelected = async (user) => {
    setSenderDetails(user)
    setChatDisplay(true);
    
    const { uid, name } = user;
    const uid2 = users.at(-1).uid;
    console.log("uid2 name ",uid2,name)
    // console.log("name<><><<>< ",name)
    await addDoc(collection(db, `chat ${uid+uid2}`), {
      senderUid: uid,
      recieverUid: uid2,
      senderDetails,
      recieverDetails: users.at(-1),
      createdAt: serverTimestamp(),
      text: message,
    });
    // setMessage("");
    //chats, 
  };
  // const senderSelected = (user)=>{
  //   console.log("seeeeeeeee",user)
  //   setSenderDetails(user)
  //   setChatDisplay(true);

  // }
  return <>
    {users?.map((user) => {
      return (
        <div>
          {user?.name}{" "}
          {/* dispatch(ChatAction()) */}
          <button onClick={()=>senderSelected(user)}>chat</button>
          </div>
      );
    })}
  </>
}

export default SideBar;
