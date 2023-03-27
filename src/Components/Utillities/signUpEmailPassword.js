import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useContext } from "react";
import { messageContext } from "../../App";
import { db } from "../../firebase";
import { errorDisplay } from "./errorDisplay";
import { IMAGES } from "./Images";

const auth = getAuth();
// signUpEmailPassword
export const signUpEmailPassword = async (
  email,
  password,
  errorMessage,
  setErrorMessage,
  navigate
) => {
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
