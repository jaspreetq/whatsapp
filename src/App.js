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

export const messageContext = createContext();

function App() {
  const [user] = useAuthState(auth);
  const [chatDisplay,setChatDisplay] = useState(false)
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [senderDetails, setSenderDetails] = useState({});
  return (
    <messageContext.Provider
      value={{ message, setMessage, errorMessage, setErrorMessage, email, setEmail, password, setPassword,chatDisplay,setChatDisplay,senderDetails,setSenderDetails}}
    >
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/" element={<Welcome />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/LiveChat/:name" element={user ? <LiveChat />:<Welcome/>} />
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
