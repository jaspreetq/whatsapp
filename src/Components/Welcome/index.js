import React from 'react'
import { useNavigate } from 'react-router-dom'
import SignIn from '../SignIn'
import { IMAGES } from '../Utillities/Images';

function Welcome() {
  const navigate = useNavigate();
  return (
    <div className='welcome'>
    <div className="registerHeader"><h2>Welcome to Whatsapp</h2></div>
    {/* <h3></h3> */}
    <img src='home/chicmic/Documents/whatsapp/src/Assets/WhatsApplogo.jpg' height="2px" width="3px"/>
      <br/><br/><br/>
      <div className='fullHeight'>ds
      <button className="w-25 mr-5" onClick={() => navigate("/SignUp")}>Register</button>
      <button className="w-25" onClick={() => navigate("/SignIn")}>Sign In</button>
      </div>
      <div className='footStyle'></div>
    </div>
  )
}

export default Welcome