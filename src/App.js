import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import './App.css';
import { useEffect } from 'react';
import SignIn from './Components/SignIn';
import Welcome from "./Components/Welcome";
import LiveChat from "./Components/LiveChat";
import SendMessage from "./Components/SendMessage";

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <br /><SignIn />
      {user ? <><LiveChat /><SendMessage /></> : <Welcome />}
    </div>
  );
}

export default App;
