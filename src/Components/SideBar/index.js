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
    return () => unsubscribe;
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
  };

  return (
    <>
      <div class="col-5 p-3 h-100">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <img class="avatar" src={IMAGES.default} alt="Avatar" />
          {"  "}
          <div className="d-flex justify-content-start">
            <div style={{ width: "390px", "margin-top": "6px" }}>
              {
                users?.find((user) => {
                  return user.uid == auth.currentUser.uid;
                })?.name
              }
            </div>
            <ul class="navbar-nav">
              <li class="nav-item dropdown">
                <div className="dropdown-menu" aria-labelledby=" ⁝ ">
                  <a class="dropdown-item" href="#">
                    Action
                  </a>
                  <a class="dropdown-item" href="#">
                    Another action
                  </a>
                  <a class="dropdown-item" href="#">
                    Something else here
                  </a>
                </div>
              </li>
            </ul>
          </div>
          {/* wordWrap:break-word */}
          {/* <div className=".justify-content-lg-end">
              ⁝
          </div> */}
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
        {/* <input
          class="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        /> */}
        <div className="scroll-left">
          {users?.map((user) => {
            if (user.uid == auth.currentUser.uid) return;
            const cssUser = recieverDetails.uid === user.uid ? " selected" : "";
            return (
              <div
                className={`user${cssUser}`}
                key={user.uid}
                onClick={() => receiverSelected(user)}
              >
                <img className="avatar" src={IMAGES.default} />
                {user?.name}
                {}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
export default SideBar;
