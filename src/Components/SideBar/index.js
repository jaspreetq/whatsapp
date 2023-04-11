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
import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { messageContext } from "../../App";
import { auth, db } from "../../firebase";
import { IMAGES } from "../Utillities/Images";
import "./styles.css";
import Header from "../Atoms/Header";
import SelectParticipants from "../Cells/SelectParticipants";
import { rightArrow, threeDotsHamburger } from "../Utillities/icons";
import EnterNewGroupDetail from "../Cells/EnterNewGroupDetail";
import { useNavigate } from "react-router-dom";
// export const GrpParticipantContext = createContext();

function SideBar() {
  const {
    activeUser,
    setActiveUser,
    setWelcomeChatPage,
    messages,
    setMessages,
    chatDisplay,
    message,
    setMessage,
    setChatDisplay,
    recieverDetails,
    setRecieverDetails,
    actualDbId,
    setActualDbId,
    users,
    setUsers,
  } = useContext(messageContext);
  let senderUserID;
  // const currentUser0 = users?.find((user) => user.uid == auth.currentUser.uid)
  const [selectedParticipants, setSelectedParticipants] = useState([{}]);
  const [showGroupAddComp, setShowGroupAddComp] = useState(false);
  const [isNewGroupBtnClicked, setIsNewGroupBtnClicked] = useState(false);
  const [groupName, setGroupName] = useState("");
  const navigate = useNavigate();
  //SIGN-OUT
  const auth = getAuth();

  const signOut = () => {
    auth.signOut();
    setWelcomeChatPage(true);
    setRecieverDetails({});
    setActiveUser({});
    setActualDbId("");
    setMessages([]);
    navigate("/");
  };

  useEffect(() => {
    isNewGroupBtnClicked && setShowGroupAddComp(false);
  }, [isNewGroupBtnClicked]);

  useEffect(() => {
    console.log("activeUser iopi", activeUser?.name);
    setSelectedParticipants(() => [...selectedParticipants]);
    console.log("selectedParticipants: ", selectedParticipants);
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

    const senderDetails = users?.find(
      (user) => user.uid == auth.currentUser.uid
    );
    setActiveUser(senderDetails);
  };

  return (
    <>
      <div class="col-5 p-3 h-100">
        {showGroupAddComp ? (
          <>
            <Header
              title="Create New group"
              goBack={() => setShowGroupAddComp(false)}
            />
            <SelectParticipants
              users={users}
              selectedParticipants={selectedParticipants}
              setSelectedParticipants={setSelectedParticipants}
              isNewGroup={true}
              isNewGroupBtnClicked={isNewGroupBtnClicked}
              setIsNewGroupBtnClicked={setIsNewGroupBtnClicked}
              showGroupAddComp={showGroupAddComp}
              setShowGroupAddComp={setShowGroupAddComp}
              groupName={groupName}
              setGroupName={setGroupName}
            />
          </>
        ) : (
          <>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
              <img class="avatar" src={IMAGES.default} alt="Avatar" />
              {"  "}
              <div className="d-flex justify-content-start w-100">
                <div style={{ width: "99%", "margin-top": "6px" }}>
                  {
                    users?.find((user) => {
                      return user.uid == auth.currentUser.uid;
                    })?.name
                  }
                </div>
{/* 
                <button
                  style={{ border: "none" }}
                  onClick={() => {
                    const initialSelected =
                      users[0].uid === auth.currentUser.uid
                        ? users[1]
                        : users[0];
                    setRecieverDetails(initialSelected);
                    setShowGroupAddComp(true);
                  }}
                >
                  {threeDotsHamburger}
                </button> */}
              </div>
              <div class="dropdown">
                {/* <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> */}
                  <button className="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                    style={{ color: "white", border: "none" }}
                  >
                    {threeDotsHamburger}
                  </button>
                {/* </button> */}
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" onClick={() => {
                      const initialSelected =
                        users[0].uid === auth.currentUser.uid
                          ? users[1]
                          : users[0];
                      setRecieverDetails(initialSelected);
                      setShowGroupAddComp(true);
                    }} href="#">Create Group</a>
                  <a class="dropdown-item" style={{cursor:"pointer"}} onClick={signOut}>SignOut</a>
                </div>
              </div>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav mr-auto"></ul>
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
                const isCurrentUserAMemberOfThisGroup =
                  user?.participants?.some(
                    (member) => member.uid === auth.currentUser.uid
                  );
                console.log(
                  isCurrentUserAMemberOfThisGroup,
                  "isCurrentUserAMemberOfThisGroup "
                );
                if (user?.groupName && !isCurrentUserAMemberOfThisGroup) return;
                const cssUser =
                  recieverDetails.uid === user.uid ? " selected" : ""; //||selectedGroup.uid === user.uid
                return (
                  <div
                    className={`user${cssUser}`}
                    key={user.uid}
                    onClick={() => receiverSelected(user)}
                  >
                    <img className="avatar" src={user?.avatar} />
                    {user?.groupName || user?.name}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
export default SideBar;
