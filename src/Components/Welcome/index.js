import React from 'react'
import { useNavigate } from 'react-router-dom'
import SignIn from '../SignIn'

function Welcome() {
  const navigate = useNavigate();
  return (
    <div>
    <h3>Welcome to Whatsapp</h3>
      <button onClick={() => navigate("/SignUp")}>Register</button>
      <button onClick={() => navigate("/SignIn")}>Sign In</button>
    </div>
  )
}

export default Welcome