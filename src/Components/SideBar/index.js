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
import UserProfile from "../Cells/UserProfile";
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
    chats,
    setChats
  } = useContext(messageContext);
  let senderUserID;
  // const currentUser0 = users?.find((user) => user.uid == auth.currentUser.uid)

  const [sortedUsers, setSortedUsers] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([{}]);
  const [showGroupAddComp, setShowGroupAddComp] = useState(false);
  const [isNewGroupBtnClicked, setIsNewGroupBtnClicked] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [groupName, setGroupName] = useState("");
  const navigate = useNavigate();
  //SIGN-OUT
  const auth = getAuth();
  const defaultRec = () => users?.find((user) => user.uid !== auth.currentUser?.uid);
  const UID = auth.currentUser.uid;
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
    isNewGroupBtnClicked && setShowGroupAddComp(false)
  }, [isNewGroupBtnClicked]);

  useEffect(() => {
    console.log("activeUser iopi", activeUser?.name);
    setSelectedParticipants(() => [...selectedParticipants]);
    console.log("selectedParticipants: ", selectedParticipants);
  }, [activeUser]);


  useEffect(() => {
    // setRecieverDetails(defaultRec());
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
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



  useEffect(() => {
    // setRecieverDetails(defaultRec());
    const q = query(collection(db, "chats"), orderBy("lastChatedAt", "desc"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let chats = [];
      console.log("<>snapshot<>", QuerySnapshot);

      QuerySnapshot.forEach((doc) => {
        chats.push({ ...doc.data() });
        console.log("messages<>: ", chats);
      });
      setChats(chats);
    });
    console.log("actualDbId in useEffectMount(sidebar) :", chats);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(chats, "chat >>..");
    //sort and filter array
    const filteredChats = chats?.filter(chat => {
      console.log(chat, "chat >>..");
      return (((chat?.participants?.some(member => member.uid.includes(UID))) || (chat?.uid?.includes(UID)) && (chat?.uid.length > 35)))
    });
    const filteredUsers = users?.filter(user => !filteredChats?.some(chat => chat.uid?.includes(user.uid)) && user.uid?.length < 29)//(user?.uid.length < 29 && user?.uid !== UID)
    const filteredChatUIds = filteredChats?.map(chat => chat.uid);
    // const filteredUsers = 
    const filteredUserUids = filteredUsers.map(user=>user.uid);
    const ids = [...filteredChatUIds,...filteredUserUids]
    console.log(ids,"ids<><><>")
    // const usersFromIds = ids.map(id => users.find(user => id?.includes(user.uid)))
    const usersFromIds = ids.map(id =>{
      if(id === UID) return users?.find(user => user.uid === id);
      if(id.length > 55)
      {
        let userIdFromChat;
        if(id.startsWith(UID)) userIdFromChat = id.substring(UID.length)
        if(id.endsWith(UID)) userIdFromChat = id.substring(0,UID.length)

        console.log(userIdFromChat," userIdFromChat ");
        return users?.find(user => user.uid === userIdFromChat)
      }
      if(id.length <= 38)
      return users?.find(user => user.uid === id)

    });
    setSortedUsers([...usersFromIds])//...filteredChats,
    console.log(usersFromIds, "<> usersFromIds", filteredUsers,sortedUsers)

  }, [chats, users])

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

    const senderDetails = getCurrentUser();
    setActiveUser(senderDetails);
  };

  const getCurrentUser = () => users?.find((user) => {
    return user.uid == auth.currentUser.uid;
  });

  
  console.log(getCurrentUser()?.avatar || IMAGES.default, "<<<<<<<<<<here");

  return (
    <>
      {console.log("actualDbId in useEffectMount(sidebar) :", chats)}
      <div class="w-25 shadow sidebar">
        {showGroupAddComp ? (
          <>
            <Header
              title="Create New group"
              goBack={() => {
                setGroupName("")
                setShowGroupAddComp(false)
              }}
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
              groupName={""}
              setGroupName={setGroupName}
            />
          </>
        ) : (
          <>
            {editProfile ? <>
              <Header title="Profile" goBack={() => setEditProfile(false)} />
              <UserProfile activeUser={getCurrentUser()} setEditProfile={setEditProfile} />
            </> :
              <>
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                  {/* getCurrentUser */}
                  <img id="unique" key="unique" className="avatar" src={getCurrentUser()?.avatar || IMAGES.default} alt="Avatar" onClick={() => setEditProfile(true)} />
                  {"  "}
                  <div className="d-flex justify-content-start w-100">
                    <div style={{ width: "99%", "margin-top": "6px", "margin-left": "7px" }}>
                      {"  "}{getCurrentUser()?.name}
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
                    <button
                      className="dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      style={{ color: "#f8f9fa00", border: "none" }}
                    >
                      {threeDotsHamburger}
                    </button>
                    {/* </button> */}
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <a
                        class="dropdown-item"
                        onClick={() => {
                          // const initialSelected =
                          //   users[0].uid === auth.currentUser.uid
                          //     ? users[1]
                          //     : users[0];
                          // setRecieverDetails(initialSelected);
                          setShowGroupAddComp(true);
                        }}
                        href="#"
                      >
                        Create Group
                      </a>
                      <a
                        class="dropdown-item"
                        style={{ cursor: "pointer" }}
                        onClick={signOut}
                      >
                        SignOut
                      </a>
                    </div>
                  </div>

                </nav>
                {/* <input
          class="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        /> */}
                <div className="scroll-left shadow sidebar">
                  {sortedUsers?.map((user) => {
                    console.log("sortedUsers ", user);
                    if (user?.uid === auth.currentUser.uid) return;
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
                      recieverDetails?.uid === user?.uid ? " selected" : ""; //||selectedGroup.uid === user.uid\
                      console.log("<><><>recoi",sortedUsers.length,sortedUsers)
                    return (
                      <div
                        className={`user${cssUser}`}
                        key={user?.uid}
                        onClick={() => receiverSelected(user)}
                      >
                        <img className="avatar" key={user?.uid} src={user?.avatar} />
                        {"  "}{user?.groupName || user?.name}
                      </div>
                    );
                  })}
                </div>
              </>
            }
          </>
        )}
      </div>
    </>
  );
}
export default SideBar;
