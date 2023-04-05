import { async } from "@firebase/util";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { messageContext } from "../../App";
import { auth, db } from "../../firebase";
import { SIDEBAR_DB_NAME } from "../ConstantStrings";
import { IMAGES } from "../Utillities/Images";
import "./styles.css";

function SideBar() {
  const [users, setUsers] = useState([]);
  const [sidebarUsers, setSidebarUsers] = useState([]);
  const {
    activeUser,
    setActiveUser,
    chatDisplay,
    message,
    setMessage,
    setChatDisplay,
    receiverDetails,
    setReceiverDetails,
    actualDbId,
    setActualDbId,
    actualDbIdCombArray,
    setActualDbIdCombArray,
  } = useContext(messageContext);
  let senderUserID;

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
    const newUsers = users?.filter((user) => user.uid !== auth.currentUser.uid);
    console.log("newUsers in useEffectMount(sidebar) :", newUsers);
    console.log("actualDbId in useEffectMount(sidebar) :", actualDbId);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // const asyncSnapshot = (async () =>
    //   await getDocs(collection(db, "users")))();
    // asyncSnapshot.forEach((doc) => {
    //   console.log("async: ", doc.data());
    // });

    onSnapshot(collection(db, SIDEBAR_DB_NAME), (snapshot) => {
      const registeredUsers = [];
      snapshot.docs.forEach((doc) => {
        registeredUsers.push({ ...doc.data() });
      });
      console.log("registeredUsers :", registeredUsers);
      registeredUsers?.map((obj, idx) => {
        const entries = Object.entries(obj);
        let userID;
        for (let [key, value] of entries) {
          if (key === "senderUserID") userID = value;
          console.log("obj : key val ", key, value);
        }
        userID && console.log("objkeys ", userID);
        console.log("obj :", obj, " \n keys ", userID, Object.keys(obj).length);
        // return [];
      });
      // console.log(
      //   "doc.data()",
      //   registeredUsers[0][
      //     "2I6cUH4PKZOAFvp7FEH79e7HiTo1PIhSVBqcoDRnFmypyAy8pysofFl2"
      //   ]
      // );
    });
    // const documents = async () => await getDocs();
    // const snapshot = documents();

    // snapshot.forEach((doc) => {
    //   // registeredUsers.push();
    // });

    // const observer = doc.onSnapshot(
    //   (docSnapshot) => {
    //     console.log(`Received doc snapshot: ${docSnapshot}`);
    //     // ...
    //   },
    //   (err) => {
    //     console.log(`Encountered error: ${err}`);
    //   }
    // );

    // const q = query(collection(db, SIDEBAR_DB_NAME), orderBy("createdAt"));
    // const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
    //   let addedUsers = [];
    //   console.log("<>snapshot<>", QuerySnapshot);

    //   QuerySnapshot.forEach((doc) => {
    //     console.log("<>snapshot foreach<>", doc, doc.id, typeof doc);
    //     addedUsers.push({ ...doc.data() });
    //     console.log("messages<>: ", addedUsers);
    //   });
    //   setSidebarUsers(addedUsers);
    // });
    // const newUsers = users?.filter((user) => user.uid !== auth.currentUser.uid);
    // console.log("newUsers in useEffectMount(sidebar) :", newUsers);
    // console.log("actualDbId in useEffectMount(sidebar) :", actualDbId);
    // return () => unsubscribe();
  }, [users]);

  useEffect(() => {
    const setDocument = async () => {
      if (!actualDbId) return null;
      return await setDoc(doc(db, "chats", actualDbId), {
        uid: actualDbId,
        senderName: activeUser.name,
        senderUid: activeUser.uid,
        receiverName: receiverDetails.name,
        receiverUid: receiverDetails.uid,
        createdAt: serverTimestamp(),
        messages: [],
      });
    };

    setDocument();
    // const add = setDoc(doc(db,SIDEBAR_DB_NAME,actualDbId),{
    //   createdBy:
    // });
    // const newSideUsers = [...sidebarUsers, user];
    // setSidebarUsers(newSideUsers);

    // const newUsers = users?.filter((curUser) => {
    //   console.log(user.name);
    //   return curUser.uid !== user.uid;
    // });
    // return !(sidebarUsers?.some(sideUser => (sideUser.uid === user.uid)))

    // console.log("newUsers: ", newUsers, newSideUsers);
    // setUsers(newUsers);

    //create user chats
    const updateDocument = async () => {
      if (!actualDbId) return null;
      return await updateDoc(doc(db, SIDEBAR_DB_NAME, activeUser.uid), {
        [actualDbId + ".userInfo"]: {
          uid: receiverDetails.uid,
          name: receiverDetails.name,
          avatar: receiverDetails.avatar,
          email: receiverDetails.email,
        },
        [actualDbId + ".time"]: serverTimestamp(),
      });
    };

    updateDocument();

    const updateDocumentSecond = async () => {
      if (!actualDbId) return null;
      return await updateDoc(doc(db, SIDEBAR_DB_NAME, receiverDetails.uid), {
        [actualDbId + ".userInfo"]: {
          uid: activeUser.uid,
          name: activeUser.name,
          avatar: activeUser.avatar,
          email: activeUser.email,
        },
        [actualDbId + ".time"]: serverTimestamp(),
      });
    };

    updateDocumentSecond();
  }, [actualDbId]);

  const addUser = async (user) => {
    const { uid, name } = user;
    setReceiverDetails(user);

    const senderUid = auth.currentUser.uid,
      receiverUid = uid;
    senderUserID = senderUid;
    // setActualDbId(receiverUid+senderUid);

    const senderDetails = users?.find((user) => user.uid == senderUid);
    setActiveUser(senderDetails);
    setActualDbId(user.uid + senderDetails.uid);

    // const docRef = await getDoc(doc(db, "chats", actualDbId));
    console.log(
      "doesn't exist without calling",
      actualDbId,
      senderDetails.name,
      receiverDetails.name
    );

    // if (!docRef.exists()  && actualDbId) return null;
    // console.log("doesn't exist");
  };

  const receiverSelected = async (user) => {
    const { uid, name } = user;

    setReceiverDetails(user);
    console.log(
      "receiverDetails: clicked",
      receiverDetails,
      "user: ",
      actualDbId,
      " "
    );
    console.log("user receiver <><><><>", name, receiverDetails);
    const senderUid = auth.currentUser.uid,
      receiverUid = uid;
    senderUserID = senderUid;
    // setActualDbId(receiverUid+senderUid);

    const senderDetails = users?.find((user) => user.uid == senderUid);
    setActiveUser(senderDetails);

    console.log(
      "auth.currentUser :",
      auth.currentUser.uid,
      auth.currentUser,
      senderDetails
    );
    console.log("uid2 name ", user);
    const chatId = receiverUid + senderUid;

    console.log("actualDbId: onclick", actualDbId);
  };
  return (
    <>
      <div className="w-25 p-3 ">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <img className="avatar" src={IMAGES.default} alt="Avatar" />
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
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto"></ul>
          </div>
        </nav>
        <input
          className="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        {sidebarUsers?.map((sidebarUsers) => {
          //filter userChats
          if (sidebarUsers.uid == auth.currentUser.uid) return;
          return (
            <div
              className="user"
              key={sidebarUsers.uid}
              // onClick={() => receiverSelected(sidebarUsers)}
            >
              <img className="avatar" src={IMAGES.default} />
              {sidebarUsers?.name}
            </div>
          );
        })}

        <br />
        <hr />
        {users?.map((user) => {
          //filter userChats
          if (user.uid == auth.currentUser.uid) return;
          return (
            <div className="user" key={user.uid} onClick={() => addUser(user)}>
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

// setActualDbIdCombArray([receiverUid + senderUid, senderUid + receiverUid]);
// const existingContact12 = await getDoc(
//   doc(db, "chats", `${receiverUid + senderUid}`)
// );
// const existingContact21 = await getDoc(
//   doc(db, "chats", `${senderUid + receiverUid}`)
// );
//

// else setActualDbId(receiverUid + senderUid);
// const dbExists = ;
// !dbExists &&

// if (!(existingContact12.exists() || existingContact21.exists()))
//   setActualDbId(receiverUid + senderUid);
// console.log("actualDbId: i", actualDbId);
// setActualDbId();
// console.log("contact exists", actualDbId);

// if (!actualDbId) {
//   if (existingContact21.exists()) setActualDbId(senderUid + receiverUid);
//   else setActualDbId(receiverUid + senderUid);
// }

// --------------------

// useEffect(() => {
//   console.log(
//     "actualDbId: effect,receiver",
//     actualDbId,
//     receiverDetails.name
//   );

//   const setDocAsync = async () => {
// const docRef = await getDoc(doc(db, "chats", actualDbId));
// console.log("doesn't exist without calling", actualDbId, docRef.exists());

// if (docRef.exists() || !actualDbId) return null;
// console.log("doesn't exist");

// await setDoc(doc(db, "chats", actualDbId), {
//   uid: actualDbId,
//   senderName: activeUser.name,
//   senderUid: activeUser.uid,
//   receiverName: receiverDetails.name,
//   receiverUid: receiverDetails.uid,
//   // senderDetails: activeUser,
//   // receiverDetails,
//   createdAt: serverTimestamp(),
//   messages: [],
// });
//   };
//   actualDbId && Object.keys(receiverDetails).length && setDocAsync();
//   console.log("actualDbId: effect", actualDbId, receiverDetails);
// }, [actualDbId,receiverDetails]);

// const querySnapshot = await getDocs(collection(db, "users"))
//       const r = []
//       querySnapshot.forEach((doc) => {

//         r.push(doc.data())
//       });
//       const y = r.filter(val => (!x.some(value => value == val.uid) && val.uid != currentUser.uid))
//       setUsers(y);
//     } catch (err) {
//       console.log(err, "Error in getting User Details")
//     }
