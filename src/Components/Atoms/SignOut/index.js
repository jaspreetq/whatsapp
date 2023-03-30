import { getAuth } from "firebase/auth";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { messageContext } from "../../../App";

function SignOut() {
  const navigate = useNavigate();
  const auth = getAuth();
  const {setWelcomeChatPage} = useContext(messageContext)
  const signOut = () => {
    auth.signOut()
    setWelcomeChatPage(true)
    navigate("/")
  };
  return <button onClick={signOut}>Sign Out</button>;
}

export default SignOut;
