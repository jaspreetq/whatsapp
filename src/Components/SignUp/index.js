import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { messageContext } from "../../App";
import { auth, db } from "../../firebase";
import { NAME_ERROR_STRING } from "../ConstantStrings";
import { errorDisplay } from "../Utillities/errorDisplay";
import { IMAGES } from "../Utillities/Images";

function SignUp() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    errorMessage,
    setErrorMessage,
    email,
    setEmail,
    password,
    setPassword,
  } = useContext(messageContext);

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setErrorMessage("");
  }, []);


  const handleSubmit = async (e) => {
    
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {

      const res = await createUserWithEmailAndPassword(auth, email, password);
      const date = new Date().getTime();
      // const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChannels", res.user.uid), {});
            // await setDoc(doc(db, "channels", res.user.uid))
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };
  // useEffect(()=>{
  //     if(name == "") {
  //         setErrorMessage("Invalid Name")
  //         // throw new Error("Invalid Name");        }
  // },[name])

  const signUpEmailPassword = async (e) => {
    const signupEmail = email;
    const signupPassword = password;
    try {
      console.log("name<><><>", name);
      if (name == "") throw new Error(NAME_ERROR_STRING);

      console.log(" Sign up in  ", email, password);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupEmail,
        signupPassword
      );
      console.log("userCredential signup", userCredential);
      const { uid } = auth.currentUser;
      await setDoc(doc(db, "users", uid), {
        uid,
        name,
        email,
        avatar: IMAGES.DP1, //random array dp generator
        createdAt: serverTimestamp(),
        // details: {uid,email,name,avatar,}
      });
      console.log("name ", name, errorMessage);
      navigate(`/LiveChat/${auth.currentUser.uid}`);
    } catch (error) {
      console.log("error ", error);
      errorDisplay(error, email, setErrorMessage);
      // showLoginError(error);
    }
  };
  return (
    <div>
      <h3>Please Register...</h3>
      <form onSubmit={signUpEmailPassword}>
        <input
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
        <input
          id="userEmail"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="text"
          placeholder="Enter email..."
        // onKeyDown={handleEnter}
        />
        <input
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
        <input className="input" required style={{ display: "none" }} type="file" id="file" />
        <button><label className="label" htmlFor="file">
          {/* <img className="img" src={Add} alt="" /> */}
          Add your profile photo
        </label></button>

        <br /><br />
        <button onClick={signUpEmailPassword}>Sign Up</button>
        <button onClick={() => navigate("/SignIn")}>Existing User, SignIn</button>
        <p style={{ color: "red" }}>{errorMessage}</p>
      </form>
    </div>
  );
}

export default SignUp;
