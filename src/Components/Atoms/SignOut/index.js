import { getAuth } from "firebase/auth";
import React from "react";

function SignOut() {
  const auth = getAuth();
  const signOut = () => auth.signOut();
  return <button onClick={signOut}>Sign Out</button>;
}

export default SignOut;
