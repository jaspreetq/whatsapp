import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import './App.css';
import { createContext, useEffect, useState } from 'react';
import SignIn from './Components/SignIn';
import Welcome from "./Components/Welcome";
import LiveChat from "./Components/LiveChat";
import SendMessage from "./Components/SendMessage";
import SideBar from "./Components/SideBar";
export const messageContext = createContext();

function App() {
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState("");
  return (
    <messageContext.Provider value={{message, setMessage}}>
      <div className="App">
        <br /><SignIn/>
        {user ? <div className="home"><SideBar/><LiveChat /></div> : <Welcome />}
      </div>
    </messageContext.Provider>
  );
}

export default App;
