import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";
import { createContext, useEffect, useState } from "react";
import SignIn from "./Components/SignIn";
import Welcome from "./Components/Welcome";
import LiveChat from "./Components/LiveChat";
import SendMessage from "./Components/Cells/SendMessage";
import SideBar from "./Components/SideBar";

export const messageContext = createContext();

function App() {
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  return (
    //routing check whatsapp ui
    <messageContext.Provider
      value={{ message, setMessage, errorMessage, setErrorMessage }}
    >
      <div className="App">
        <br />
        {user ? (
          <div className="home">
            <SideBar />
            <LiveChat />
          </div>
        ) : (
          <SignIn />
        )}
      </div>
    </messageContext.Provider>
  );
}

export default App;
