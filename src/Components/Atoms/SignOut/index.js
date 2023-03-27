import { getAuth } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router-dom";

function SignOut() {
  const navigate = useNavigate();
  const auth = getAuth();
  const signOut = () => {
    auth.signOut()
    navigate("/")
  };
  return <button onClick={signOut}>Sign Out</button>;
}

export default SignOut;
