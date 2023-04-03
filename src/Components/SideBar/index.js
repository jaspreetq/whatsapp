import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { messageContext } from "../../App";
import { auth, db } from "../../firebase";
import { IMAGES } from "../Utillities/Images";
import "./styles.css";

function SideBar() {
  const [users, setUsers] = useState([]);
  const {
    activeUser,
    setActiveUser,
    chatDisplay,
    message,
    setMessage,
    setChatDisplay,
    recieverDetails,
    setRecieverDetails,
    actualDbId,
    setActualDbId,
  } = useContext(messageContext);
  let senderUserID;

  useEffect(() => {
    console.log("activeUser iopi", activeUser.name);
  }, [activeUser]);

  useEffect(() => {
    console.log("recieverDetails: effect", recieverDetails);
  }, [recieverDetails]);

  useEffect(() => {
    console.log(
      "actualDbId: effect,reciever",
      actualDbId,
      recieverDetails.name
    );
    const setDocAsync = async () => {
      const docRef = await getDoc(doc(db, "chats", actualDbId));
      console.log("doesn't exist", actualDbId, docRef.exists());
      if (docRef.exists() || !actualDbId) return null;
      console.log("doesn't exist");
      await setDoc(doc(db, "chats", actualDbId), {
        uid: actualDbId,
        senderUid: activeUser.uid,
        recieverUid: recieverDetails.uid,
        senderDetails: activeUser,
        recieverDetails,
        createdAt: serverTimestamp(),
        messages: [],
      });
    };
    actualDbId && Object.keys(recieverDetails).length && setDocAsync();
    console.log("actualDbId: effect", actualDbId, recieverDetails);
  }, [actualDbId]);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let users = [];
      console.log("<>snapshot<>", QuerySnapshot);

      QuerySnapshot.forEach((doc) => {
        console.log("<>snapshot foreach<>", doc, doc.id, typeof doc);
        users.push({ ...doc.data() });
        console.log("messages<>: ", users);
      });
      setUsers(users);
    });
    console.log("actualDbId in useEffectMount(sidebar) :", actualDbId);
    return () => unsubscribe();
  }, []);

  const receiverSelected = async (user) => {
    setRecieverDetails(user);
    setChatDisplay(true);
    console.log("recieverDetails:", recieverDetails, "user: ", actualDbId, " ");
    const { uid, name } = user;
    // senderUser = auth.currentUser;
    console.log("user reciever <><><><>", name);
    const senderUid = auth.currentUser.uid,
      recieverUid = uid;
    senderUserID = senderUid;
    // setActualDbId(recieverUid+senderUid);

    const senderDetails = users?.find((user) => user.uid == senderUid);
    setActiveUser(senderDetails);

    console.log(
      "auth.currentUser :",
      auth.currentUser.uid,
      auth.currentUser,
      senderDetails
    );
    console.log("uid2 name ", user);

    const existingContact12 = await getDoc(
      doc(db, "chats", `${recieverUid + senderUid}`)
    );
    const existingContact21 = await getDoc(
      doc(db, "chats", `${senderUid + recieverUid}`)
    );
    //
    console.log("actualDbId:", actualDbId);

    // else setActualDbId(recieverUid + senderUid);
    // const dbExists = ;
    // !dbExists &&

    if (!(existingContact12.exists() || existingContact21.exists()))
      setActualDbId(recieverUid + senderUid);
    console.log("actualDbId: i", actualDbId);
    // setActualDbId();
    console.log("contact exists", actualDbId);

    if (!actualDbId) {
      if (existingContact21.exists()) setActualDbId(senderUid + recieverUid);
      else setActualDbId(recieverUid + senderUid);
    }
  };
  return (
    <>
      <div class="w-25 p-3 ">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <img class="avatar" src={IMAGES.default} alt="Avatar" />
          {"  "}
          <h6>
            {
              users?.find((user) => {
                return user.uid == auth.currentUser.uid;
              })?.name
            }
          </h6>
          {/* wordWrap:break-word */}

          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto"></ul>
          </div>
        </nav>
        <input
          class="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        {users?.map((user) => {
          if (user.uid == auth.currentUser.uid) return;
          return (
            <div
              className="user"
              key={user.uid}
              onClick={() => receiverSelected(user)}
            >
              <img className="avatar" src={IMAGES.default} />
              {user?.name}
            </div>
          );
        })}
      </div>
    </>
  );
}
export default SideBar;
