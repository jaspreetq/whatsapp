import {getAuth} from "firebase/auth";
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
  updateDoc,
} from "firebase/firestore";
import React, {createContext, useContext, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {messageContext} from "../../App";
import {auth, db} from "../../firebase";
import {IMAGES} from "../Utillities/Images";
import "./styles.css";
import Header from "../Atoms/Header"; 
import SelectParticipants from "../Cells/SelectParticipants";
import {rightArrow, threeDotsHamburger} from "../Utillities/icons";
import {useNavigate} from "react-router-dom";
import UserProfile from "../Cells/UserProfile";
import {getUserFromUid} from "../Utillities/getUserFromUid";
import getActiveUserId from "../Utillities/getActiveUserId";
import getChatDbId from "../Utillities/getChatDbId";
import {RANDOM_TEXT} from "../../ConstantString";
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
    setChats,
    setLoading,
    loading, unseenCounter, setUnseenCounter, lastMessage, setLastMessage
  } = useContext(messageContext);
  let senderUserID;
  // const currentUser0 = users?.find((user) => user.uid == auth.currentUser.uid)

  const [sortedUsers, setSortedUsers] = useState([]);
  const [displayRecords, setDisplayRecords] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([{}]);
  const [showGroupAddComp, setShowGroupAddComp] = useState(false);
  const [isNewGroupBtnClicked, setIsNewGroupBtnClicked] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [searchedTerm, setSearchedTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
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
    isNewGroupBtnClicked && setShowGroupAddComp(false);
  }, [isNewGroupBtnClicked]);

  useEffect(() => {
    setSelectedParticipants(() => [...selectedParticipants]);
  }, [activeUser]);

  useEffect(() => {
    // setRecieverDetails(defaultRec());
    setDisplayRecords(sortedUsers);
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let users = [];

      QuerySnapshot.forEach((doc) => {
        users.push({...doc.data()});
      });
      setUsers(users);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setSearchedTerm("");
  }, [chats?.messages]);

  useEffect(() => {
    // setRecieverDetails(defaultRec());
    const q = query(collection(db, "chats"), orderBy("lastChatedAt", "desc"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let chats = [];
      QuerySnapshot.forEach((doc) => {
        chats.push({...doc.data()});
      });
      setChats(chats);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {

    // const asyncCountUpdate = async () => await updateDoc(doc(db, "users", recieverDetails?.uid), {
    //   uid: recieverDetails?.uid,
    //   groupName: recieverDetails?.groupName,
    //   participants: [...recieverDetails?.participants],
    //   avatar: recieverDetails?.avatar, //random array dp generator
    //   createdAt: recieverDetails?.createdAt,
    //   creatorUid: recieverDetails?.creatorUid,
    //   lastChat: {...(recieverDetails?.lastChat || {})},
    //   unseenMessageCount: {...unseenCounter, ...{[getActiveUserId()]: 0}}
    // });
    // recieverDetails?.groupName && asyncCountUpdate();

    const updateCntTo0 = async () => (await updateDoc(doc(db, "users", activeUser?.uid), {
      uid: activeUser.uid,
      name: activeUser.name,
      email: activeUser.email,
      avatar: activeUser.avatar, //random array dp generator
      createdAt: activeUser.createdAt,
      lastChat: {...(activeUser?.lastChat || {}), [actualDbId]: lastMessage},
      unseenMessageCount: {
        ...unseenCounter,
        ...{[actualDbId]: 0},
      },
    }));

    recieverDetails?.name && updateCntTo0();

    console.log("getUserFromUid(activeUser", unseenCounter);
  }, [unseenCounter])

  useEffect(() => {
    //sort and filter array
    const filteredChats = chats?.filter((chat) => {
      return (
        chat?.participants?.some((member) => member?.uid?.includes(UID)) ||
        (chat?.uid?.includes(UID) && chat?.uid.length > 35)
      );
    });
    const filteredUsers = users?.filter(
      (user) =>
        !filteredChats?.some((chat) => chat.uid?.includes(user.uid)) &&
        user.uid?.length < 29
    ); //(user?.uid.length < 29 && user?.uid !== UID)
    const filteredChatUIds = filteredChats?.map((chat) => chat.uid);
    // const filteredUsers =
    const filteredUserUids = filteredUsers.map((user) => user.uid);
    const ids = [...filteredChatUIds, ...filteredUserUids];

    // const usersFromIds = ids.map(id => users.find(user => id?.includes(user.uid)))
    const usersFromIds = ids.map((id) => {
      if (id === UID) return users?.find((user) => user.uid === id);
      if (id.length > 55) {
        let userIdFromChat;
        if (id.startsWith(UID)) userIdFromChat = id.substring(UID.length);
        if (id.endsWith(UID)) userIdFromChat = id.substring(0, UID.length);

        return users?.find((user) => user.uid === userIdFromChat);
      }
      if (id.length <= 38) return users?.find((user) => user.uid === id);
    });
    setSortedUsers([...usersFromIds]); //...filteredChats,
    setDisplayRecords([...usersFromIds]);
  }, [chats, users]);

  const receiverSelected = async (user) => {
    setRecieverDetails(user);
    setChatDisplay(true);

    const {uid, name} = user;
    // senderUser = auth.currentUser;

    const senderUid = auth.currentUser.uid,
      recieverUid = uid;
    senderUserID = senderUid;
    // setActualDbId(recieverUid+senderUid);

    const senderDetails = getCurrentUser();
    setActiveUser(senderDetails);
  };

  const getCurrentUser = () =>
    users?.find((user) => {
      return user.uid == auth.currentUser.uid;
    });

  useEffect(() => {
    //searched records
    let filteredArr = sortedUsers?.filter((record) => {
      let lowerCaseSearch = searchedTerm.toLowerCase();
      const lowerUserName = (record?.name || record?.groupName)?.toLowerCase();
      return lowerUserName.includes(lowerCaseSearch);
    });

    setLoading(false);
    setFilteredUsers(filteredArr);

    return () => { };

    // setLoading(false);
  }, [searchedTerm]);

  useEffect(() => {
    if (searchedTerm.trim === "") setDisplayRecords([...sortedUsers]);
    else setDisplayRecords(filteredUsers);
  }, [filteredUsers]);

  return (
    <>
      <div class="w-25 shadow sidebar">
        {showGroupAddComp ? (
          <>
            <Header
              title="Create New group"
              goBack={() => {
                setGroupName("");
                setRecieverDetails(getUserFromUid(actualDbId, users));
                setShowGroupAddComp(false);
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
            {editProfile ? (
              <>
                <Header title="Profile" goBack={() => setEditProfile(false)} />
                <UserProfile
                  activeUser={getCurrentUser()}
                  setEditProfile={setEditProfile}
                />
              </>
            ) : (
              <>
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                  {/* getCurrentUser */}
                  <img
                    height="50"
                    width="50"
                    id={auth.currentUser.uid}
                    key={auth.currentUser.uid}
                    className="avatar"
                    src={getCurrentUser()?.avatar || IMAGES.default}
                    alt="Avatar"
                    onClick={() => setEditProfile(true)}
                  />
                  {"  "}
                  <div className="d-flex justify-content-start w-100">
                    <div
                      style={{
                        width: "99%",
                        "margin-top": "6px",
                        "margin-left": "7px",
                      }}
                    >
                      {"  "}
                      {getCurrentUser()?.name}
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
                      style={{color: "#f8f9fa00", border: "none"}}
                    >
                      {threeDotsHamburger}
                    </button>
                    {/* </button> */}
                    <div
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
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
                        style={{cursor: "pointer"}}
                        onClick={signOut}
                      >
                        SignOut
                      </a>
                    </div>
                  </div>
                </nav>
                <input
                  class="form-control mr-sm-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchedTerm}
                  onChange={(e) => setSearchedTerm(e.target.value)}
                />
                <div className="scroll-left shadow sidebar">
                  {displayRecords.length ? (
                    (displayRecords || sortedUsers)?.map((user) => {
                      if (user?.uid === auth.currentUser.uid) return;
                      const isCurrentUserAMemberOfThisGroup =
                        user?.participants?.some(
                          (member) => member.uid === auth.currentUser.uid
                        );

                      if (user?.groupName && !isCurrentUserAMemberOfThisGroup)
                        return;
                      const cssUser =
                        recieverDetails?.uid === user?.uid ? " selected" : ""; //||selectedGroup.uid === user.uid\

                      const badgeNo = user?.groupName ? user?.unseenMessageCount[auth?.currentUser?.uid]
                        : getUserFromUid(getActiveUserId(), users)?.unseenMessageCount[getChatDbId(user, getUserFromUid(getActiveUserId(), users))]

                      const lastChatUser = user?.lastChat?.[user?.uid] ||
                        user?.lastChat?.[
                        Object.keys(user?.lastChat || {})?.find(
                          (chatId) =>
                            chatId.length > 54 &&
                            chatId.includes(user?.uid) &&
                            chatId.includes(auth.currentUser.uid)
                        )]
                      let lastChatGrpKey
                      let lastChatGrpValue
                      let lastChatGrpKeyStr
                      let finalLastChatGrpString = "";

                      const lastChatGrp = user?.lastChat;
                      if (lastChatGrp && Object.keys(lastChatGrp).length && user.groupName) {
                        console.log(lastChatGrp, recieverDetails?.uid, "lastChatGrp");
                        console.log(Object.keys(lastChatGrp)[0], "lastChat in sidebar", Object.values(lastChatGrp)[0])
                        lastChatGrpKey = Object.keys(lastChatGrp)[0];
                        lastChatGrpValue = Object.values(lastChatGrp)[0];
                        lastChatGrpKeyStr = (lastChatGrpKey === getActiveUserId()) ? "You: " : `${getUserFromUid(lastChatGrpKey, users)?.name}: `
                        finalLastChatGrpString = lastChatGrpKeyStr + lastChatGrpValue;
                      }
                      return (
                        <div
                          className={`user${cssUser}`}
                          key={user?.uid}
                          id={user?.uid}
                          onClick={() => receiverSelected(user)}
                        >
                          {lastChatUser || finalLastChatGrpString ?
                            <img
                              className="avatar"
                              id={user?.uid}
                              key={user?.uid}
                              src={user?.avatar}
                              style={{"margin-top": "-21px"}}
                            />
                            : <img className="avatar"
                              id={user?.uid}
                              key={user?.uid}
                              src={user?.avatar}
                            />
                          }


                          {"  "}
                          <div className="name">{user?.groupName || user?.name}
                            {/* style={{"display": "inline"}} */}
                            <p className="lastMssg">
                              {lastChatUser || finalLastChatGrpString}
                              {/* || user?.lastChat?.[getChatDbId(user, getUserFromUid(getActiveUserId()))] */}
                            </p>
                          </div>
                          <span className="badge">
                            {badgeNo || ""}
                          </span>
                          {user.name && console.log(user.unseenMessageCount[getChatDbId(user, getUserFromUid(getActiveUserId(), users))], "user.unseenMessageCount")}
                          {/* user.unseenMessageCount[
                              getChatDbId(
                                user,
                                getUserFromUid(getActiveUserId())
                              )
                            ] */}
                          {/* && user?.lastChat?.keys?.includes(user?.uid))  */}
                        </div>
                      );
                    })
                  ) : (
                    <h6>No user or group found</h6>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
export default SideBar;
