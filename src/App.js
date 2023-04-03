import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";
import { createContext, useEffect, useState } from "react";
import SignIn from "./Components/SignIn";
import Welcome from "./Components/Welcome";
import LiveChat from "./Components/LiveChat";
import SendMessage from "./Components/Cells/SendMessage";
import SideBar from "./Components/SideBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./Components/SignUp";
import { onAuthStateChanged } from "firebase/auth";

export const messageContext = createContext();

function App() {
  const [user] = useAuthState(auth);
  const [chatDisplay, setChatDisplay] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recieverDetails, setRecieverDetails] = useState({});
  const [activeUser, setActiveUser] = useState({});
  const [welcomeChatPage, setWelcomeChatPage] = useState(true);
  const [actualDbId, setActualDbId] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const clear = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setActiveUser(user);
        setRecieverDetails({})
        setWelcomeChatPage(true);
        console.log("<><><><><", user.displayName, user.uid);
        // ...
      } else {
        setWelcomeChatPage(true);
        // User is signed out
        // ...
      }
    });

    return () => clear();
  }, []);

  return (
    <messageContext.Provider
      value={{
        welcomeChatPage,
        setWelcomeChatPage,
        message,
        setMessage,
        errorMessage,
        setErrorMessage,
        email,
        setEmail,
        password,
        setPassword,
        chatDisplay,
        setChatDisplay,
        recieverDetails,
        setRecieverDetails,
        activeUser,
        setActiveUser,
        actualDbId,
        setActualDbId,
        messages,
        setMessages,
      }}
    >
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/" element={<Welcome />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route
              path="/LiveChat/:name"
              element={user ? <LiveChat /> : <Welcome />}
            />
          </Routes>
        </BrowserRouter>
        {/* <br />
          {user ? (
            <div className="home">
              <SideBar />
              <LiveChat />
            </div>
          ) : (
            <SignIn />
          )} */}
      </div>
    </messageContext.Provider>
  );
}

export default App;
