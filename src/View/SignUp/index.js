import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../../firebase";
import { NAME_ERROR_STRING, SENT_VERIFICATION_LINK } from "../../Components/ConstantStrings";
import { errorDisplay } from "../../Components/Utillities/errorDisplay";
import { IMAGES } from "../../Components/Utillities/Images";
import "./styles.css";
import { messageContext } from "../../App";
import { LINK } from "../../ConstantString";
// import { LINK } from "../../ConstantString";

function SignUp() {
  const [name, setName] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const navigate = useNavigate();
  const {
    errorMessage,
    setErrorMessage,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    setLoading,
    users,
    setUsers
  } = useContext(messageContext);

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setErrorMessage("");
    setLoading(false);
    console.log(users, " inside signup users");

    // userList.splice(0,userList.length);

    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    // const secondQuery = query(collection(db, "chats"), orderBy("createdAt","desc"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      console.log("<>snapshot<>", QuerySnapshot, QuerySnapshot?.docs?.length);
      const userList = [];
      QuerySnapshot?.forEach((doc) => {
        userList.push({ ...doc.data() });
        console.log("mount snap: ", doc.data(), userList);
      });
      setUsers(userList);
    });
    return () => unsubscribe();
  }, []);

  console.log(users, "users<><>");

  // useEffect(()=>{
  //     if(name == "") {
  //         setErrorMessage("Invalid Name")
  //         // throw new Error("Invalid Name");        }
  // },[name])

  const signUpEmailPassword = async () => {
    const signupEmail = email;
    const signupPassword = password;
    try {
      if (name == "") throw new Error(NAME_ERROR_STRING);

      console.log(" Sign up in  ", email, password);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupEmail,
        signupPassword
      );

      // const actionCodeSettings = {
      //   url: "http://localhost:3000/login",
      //   handleCodeInApp: true
      // };
      // await sendEmailVerification(userCredential.user, actionCodeSettings)
      // setVerificationMessage(SENT_VERIFICATION_LINK)

      // console.log("userCredential signup", userCredential);
      const { uid } = auth.currentUser;
      await setDoc(doc(db, "users", uid), {
        uid,
        name,
        email,
        avatar: IMAGES.default, //random array dp generator
        createdAt: serverTimestamp(),
        lastChatedAt: serverTimestamp(),
        lastChat: ""
        // details: {uid,email,name,avatar,}
      });

      // await setDoc(doc(db, `usersChatMetaData/${user?.uid}/users`, user.uid), {        
      console.log("before doc creation", users);
      users?.map(async (user) => {
        await setDoc(doc(db, `usersChatMetaData/${uid}/users`, user?.uid), {
          uid: user.uid,
          name: user.name || user.groupName,
          email: user.email,
          avatar: user.avatar, //random array dp generator
          createdAt: user.createdAt,
          lastChatedAt: serverTimestamp(),
          lastChat: ""
          // details: {uid,email,name,avatar,}
        });
      })

      console.log("name ", name, errorMessage);
      navigate(`/LiveChat/${auth.currentUser.uid}`);
    } catch (error) {
      console.log("error ", error);
      errorDisplay(error, email, setErrorMessage);
      // showLoginError(error);
    }
  };
  return (
    <div className="Signup">
      {console.log("render")}
      <div className="form centered">
        <div className="registerHeader">
          <h2>Whatsapp-Web</h2>
        </div>
        {/* <h2>Whatsapp-Web</h2> */}
        <h3 style={{ "margin-left": "28%" }}>Please Register....</h3>
        {/* <label>Username:</label> */}
        <input
          className="textInput"
          id="userName"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          type="text"
          placeholder="Enter Name..."
          required
        // onKeyDown={handleEnter}
        />
        {/* <label>Email:</label> */}
        <input
          className="textInput"
          id="userEmail"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="text"
          placeholder="Enter email..."
        // onKeyDown={handleEnter}
        />
        {/* <label>Password:</label> */}
        <input
          className="textInput"
          id="userPassword"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          placeholder="Enter Password..."
        // onKeyDown={handleEnter}
        />
        <br />
        <p style={{ color: "red" }}>{errorMessage}</p>
        <br />
        <div className="centered-btn">
          <button
            className="registration enlarged"
            onClick={(e) => {
              setLoading(true);
              signUpEmailPassword(e);
            }}
          >
            Sign Up
          </button>

          <button
            className="registration enlarged"
            onClick={() => {
              setLoading(true);
              return navigate("/SignIn");
            }}
          >
            Existing User: SignIn
          </button>
          <p className="text-danger">{verificationMessage}</p>

        </div>
      </div>
      <div className="rightSideImage"></div>
    </div>
  );
}

export default SignUp;
