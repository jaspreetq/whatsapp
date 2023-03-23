import React, { useState } from 'react'
import { auth } from '../../firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

function SignIn() {
    const [user] = useAuthState(auth);
    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);
    };

    const signOut = () => {
        auth.signOut();
    };
    return (
        <div>
            {user ? <button onClick={signOut}>Sign Out</button> :
                <button onClick={googleSignIn}>Sign In G</button>
            }
            {/* Login with Phone Number or Anonymous with Metamask
            - 1 to 1 Chat  */}

            {/* <button onClick={()=>setUser(false)}>Sign Out</button> */}
            {/* <label>User Name : </label>
            <input name="userName" placeholder='Enter your Name:' />
            <label>User  : </label>
            <input name="userName" placeholder='Enter your Name:' /> */}
            {/* <input name="userGmail" type="text" placeholder='enter your gmail'>Gmail:</input> */}
        </div>
    )
}

export default SignIn