import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { messageContext } from "../../App";
import { auth, db } from "../../firebase";
import { IMAGES } from "../Utillities/Images";
import "./styles.css"

function SideBar() {

  // const dispatch = useDispatch();
  // const chatWith1 = useSelector(state => state.MessageReducer)
  const [users, setUsers] = useState([]);
  const { activeUser, setActiveUser, chatDisplay, message, setMessage, setChatDisplay, recieverDetails, setRecieverDetails } = useContext(messageContext);
  let senderUserID;

  useEffect(() => {
    console.log("activeUser iopi", activeUser.name)
  }, [activeUser])

  useEffect(() => {
    // console.log(setRecieverDetails({abc:"ds"},senderDetails))
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
  // getAuth().onAuthStateChanged((user) => {
  //   if (user) {
  //     // User logged in already or has just logged in.
  //     console.log("user.uid :", user);
  //     senderUser = user;
  //   }
  // });
  const receiverSelected = async (user) => {
    //sender - me
    //reciever - the other person
    //both can send and recieve, this is just a name
    setRecieverDetails(user)
    setChatDisplay(true);
    console.log("recieverDetails:", recieverDetails, "user: ", user, " ")
    const { uid, name } = user;
    // senderUser = auth.currentUser;
    console.log("user reciever <><><><>", name)
    const senderUid = auth.currentUser.uid, recieverUid = uid;
    senderUserID = senderUid;
    const senderDetails = users?.find((user) => user.uid == senderUid);
    setActiveUser(senderDetails);
    // console.log("db.collection.doc(senderUid).get ",db.collection(db, "users").doc(senderUid).get())

    console.log("auth.currentUser :", auth.currentUser.uid, auth.currentUser, senderDetails)
    console.log("uid2 name ", user)
    // console.log("name<><><<>< ",name)
    //setDoc
    const existingContact12 = await getDoc(doc(db, "chats", `${recieverUid + senderUid}`))
    const existingContact21 = await getDoc(doc(db, "chats", `${senderUid + recieverUid}`))
    let actualDb;
    // let actualDb = (existingContact12.exists()?existingContact12: existingContact21.exists()? existingContact21:null);

    if(existingContact12.exists())
      actualDb = existingContact12;
    else if(existingContact21.exists())
      actualDb = existingContact21;
    else
      actualDb = null;

    console.log(" actualDb ",actualDb)

    if (!actualDb) {
      // console.log("iid");
      const iid = await setDoc(doc(db, "chats", `${recieverUid + senderUid}`), {
        uid: recieverUid + senderUid,
        senderUid,
        recieverUid,
        senderDetails,
        recieverDetails: user,
        createdAt: serverTimestamp(),
        messages: []
      });
    }
      else{
        console.log("contact exists")
      }
    const docRef = doc(db, "chats", `${recieverUid + senderUid}`);
    const docSnap = await getDoc(docRef);

    // if (docSnap.exists()) {
    //   docSnap.data().messages?.push("dfs");
    //   console.log("Document data:", docSnap.data(), "\n docSnap:", docSnap, "\n snaps:", docSnap.data().messages);

    // } else {
    //   // doc.data() will be undefined in this case
    //   console.log("No such document!");
    // }

    // setMessage("");
    //chats, 
  };
  // const senderSelected = (user)=>{
  //   console.log("seeeeeeeee",user)
  //   setRecieverDetails(user)
  //   setChatDisplay(true);

  // }
  // console.log("activeUseractiveUser: ",users?.find((user) => {return user.uid == auth.currentUser.uid})?.name)
  return (
    <>
      <div class="w-25 p-3 ">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <img class="avatar" src={IMAGES.default} alt="Avatar" />
          {/* {JSON.stringify(auth.currentUser)} */}
          {"  "}
          <h6>{users?.find((user) => { return user.uid == auth.currentUser.uid })?.name}</h6>
          {/* wordWrap:break-word */}

          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
            </ul>
          </div>
        </nav>
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
        {users?.map((user) => {
          if (user.uid == auth.currentUser.uid) return;
          return (
            <div className="user" onClick={() => receiverSelected(user)}>
              <img className="avatar" src={IMAGES.default} />
              {user?.name}
              {/* dispatch(ChatAction()) */}
              {/* <button onClick={() => receiverSelected(user)}>chat</button> */}
            </div>
          );
        })}
      </div>

    </>
  );
}

export default SideBar;