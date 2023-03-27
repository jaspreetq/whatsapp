import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";
import { createContext, useEffect, useState } from "react";
import SignIn from "./Components/SignIn";
import Welcome from "./Components/Welcome";
import LiveChat from "./Components/LiveChat";
import SendMessage from "./Components/Cells/SendMessage";
import SideBar from "./Components/SideBar";
import { Route, Routes } from "react-router-dom";

export const messageContext = createContext();

function App() {
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  return (
      <messageContext.Provider
        value={{ message, setMessage, errorMessage, setErrorMessage}}
      >
        <div className="App">
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="LiveChat" element={<LiveChat />} />
          </Routes>
          
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
