import React, { useState } from 'react'
import { auth } from '../../firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { connectAuthEmulator, createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect,onAuthStateChanged} from "firebase/auth";
import CustomModal from '../CustomComponents/CustomModal';
import ErrorDisplay from '../ErrorDisplay';

function SignIn() {
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const auth = getAuth();
    const [errorMessage,setErrorMessage] = useState();
    const [user] = useAuthState(auth);

    // connectAuthEmulator(auth, "http://localhost:9899");
    const handleSignIn = () => {
        // setShowModal(true);
        // const uidExists = getAuth().getUser(uid).then(() => true).catch(() => false)
        // const emailExists = getAuth().getUserByEmail(email).then(() => true).catch(() => false);
        // emailExists? loginEmailPassword() : signUpEmailPassword();
        // displayLoginStatus();
        loginEmailPassword()
    }
    const handleSignUp = () =>{
        signUpEmailPassword()
    }
    
    // .then(u => {})
    // .catch(error => {
       
    // });
    
    const signUpEmailPassword = async () => {
        const signupEmail = email;
        const signupPassword = password;
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
        }
        catch (error) {
            console.log(error);
            
            // showLoginError(error);
        }
    }
    const displayLoginStatus = ()=>{

    }

    const loginEmailPassword = async () => {
        // console.log(emailExists)
        const loginEmail = email;
        const loginPassword = password;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
        }
        catch (error) {
            console.log(error);
            // showLoginError(error);
            <ErrorDisplay errorCode = {error.code} errorMessage = {errorMessage} setErrorMessage={setErrorMessage} email = {email}/>
        }
    }
    
    // // const auth = getAuth();
    // onAuthStateChanged(auth, (user) => {
    //     if (user) {
    //         // User is signed in, see docs for a list of available properties
    //         // https://firebase.google.com/docs/reference/js/firebase.User
    //         const uid = user.uid;
    //         let cnt = 0;
    //         cnt++ && console.log("signed in ",uid)
    //         // ...
    //     } else {
    //         // User is signed out
    //         // ...
    //     }
    // });


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
            }).catch((error) => {
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

    const signOut = () => {
        auth.signOut();
    };
    return (
        <div>
            {user ? <button onClick={signOut}>Sign Out</button> :
                <>
                    <input
                        id="userEmail"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        type="text" placeholder='Enter email...'
                    // onKeyDown={handleEnter}
                    />
                    <input
                        id="userPassword"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        type="text" placeholder='Enter Password...'
                    // onKeyDown={handleEnter}
                    />
                    <br /><br />
                    <button onClick={googleSignIn}>Sign In G</button>
                    <button onClick={handleSignIn}>Sign In</button>
                    <button onClick={handleSignUp}>Sign Up</button>
                </>
            }
            {/* <CustomModal visible={showModal} showModal={showModal} setShowModal={setShowModal} title={"Login"}> */}

            {/* </CustomModal> */}
            {/* Login with Phone Number or Anonymous with Metamask
            - 1 to 1 Chat  */}

            {/* <button onClick={()=>setUser(false)}>Sign Out</button> */}
            {/* <label>User email : </label>
            <input email="useremail" placeholder='Enter your email:' />
            <label>User  : </label>
            <input email="useremail" placeholder='Enter your email:' /> */}
            {/* <input email="userGmail" type="text" placeholder='enter your gmail'>Gmail:</input> */}
        </div>
    )
}

export default SignIn