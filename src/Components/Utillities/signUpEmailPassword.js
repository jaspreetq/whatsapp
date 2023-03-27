import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useContext } from "react";
import { messageContext } from "../../App";
import { errorDisplay } from "./errorDisplay";
const auth = getAuth();

// signUpEmailPassword
export const signUpEmailPassword = async (
  email,
  password,
  errorMessage,
  setErrorMessage
) => {
  const signupEmail = email;
  const signupPassword = password;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      signupEmail,
      signupPassword
    );
  } catch (error) {
    console.log(error);
    errorDisplay(error, email, setErrorMessage);
    // showLoginError(error);
  }
};
