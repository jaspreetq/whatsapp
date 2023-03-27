import React, { useContext, useState } from "react";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
    connectAuthEmulator,
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    onAuthStateChanged,
} from "firebase/auth";
import { messageContext } from "../../App";
import { errorDisplay } from "../Utillities/errorDisplay";
// import { signUpEmailPassword } from "../Utillities/signUpEmailPassword";
import { useNavigate } from "react-router-dom";
import { IMAGES } from "../Utillities/Images";

function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [userDetailsObj, setUserDetailsObj] = useState({});
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const auth = getAuth();
    const [user] = useAuthState(auth);
    const { errorMessage, setErrorMessage } = useContext(messageContext);

    // connectAuthEmulator(auth, "http://localhost:9899");
    const handleSignIn = () => {
        loginEmailPassword();
    };

    const handleSignUp = () => {
        signUpEmailPassword();
    };

    // const displayLoginStatus = () => { 

    // };
    // const auth = getAuth();
    // signUpEmailPassword
    const signUpEmailPassword = async () => {
        const signupEmail = email;
        const signupPassword = password;
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                signupEmail,
                signupPassword
            );
            const { uid } = auth.currentUser;
            await addDoc(collection(db, "users"), {
                uid,
                email,
                avatar: IMAGES.DP1,//random array dp generator
                createdAt: serverTimestamp(),
            });
            navigate("LiveChat");
        } catch (error) {
            console.log(error);
            errorDisplay(error, email, setErrorMessage);
            // showLoginError(error);
        }
    };


    const loginEmailPassword = async () => {
        // console.log(emailExists)
        const loginEmail = email;
        const loginPassword = password;
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                loginEmail,
                loginPassword
            );
            setErrorMessage("");
            navigate("LiveChat");
        } catch (error) {
            console.log(error);
            // showLoginError(error);
            errorDisplay(error, name, email, setErrorMessage);
        }
    };

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
                setErrorMessage("");
                navigate("LiveChat")
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    };

    return (
        <>
            <h3>Please Register...</h3>
            {!user && <input
                id="userName"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                }}
                type="text"
                placeholder="Enter Name..."
            // onKeyDown={handleEnter}
            />}
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
            <br />
            <button onClick={googleSignIn}>Sign In G</button>
            {user && <button onClick={handleSignIn}>Sign In</button>}
            {!user && <button onClick={handleSignUp}>Sign Up</button>}
            <p style={{ color: "red" }}>{errorMessage}</p>
        </>
    );
}
export default SignIn;