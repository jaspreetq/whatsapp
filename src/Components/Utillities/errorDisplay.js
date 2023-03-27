export const errorDisplay = (error, name, email, setErrorMessage) => {
  console.log("In utility :", error.code);
  switch (error.code) {
    case "auth/email-already-in-use":
      setErrorMessage(`Email address ${email} already in use.`);
      break;
    case "auth/user-not-found":
      setErrorMessage(
        `Email address ${email} is not signed up. Kindly Sign up`
      );
      break;
    case "auth/invalid-email":
      setErrorMessage(`Email address ${email} is invalid.`);
      break;
    case "auth/operation-not-allowed":
      setErrorMessage(`Error during sign up.`);
      break;
    case "auth/weak-password":
      setErrorMessage(
        "Password is not strong enough. Add additional characters including special characters and numbers."
      );
      break;
    case "auth/wrong-password":
      setErrorMessage("Wrong Password !");
      break;
    default:
      setErrorMessage(error.code);
      break;
  }
};
