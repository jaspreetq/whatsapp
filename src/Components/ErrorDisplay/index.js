import React from 'react'

function ErrorDisplay({errorCode,errorMessage,setErrorMessage,email}) {
    switch (errorCode) {
        case 'auth/email-already-in-use':
          setErrorMessage(`Email address ${email} already in use.`);
          break;
        case 'auth/invalid-email':
            setErrorMessage(`Email address ${email} is invalid.`);
          break;
        case 'auth/operation-not-allowed':
            setErrorMessage(`Error during sign up.`);
          break;
        case 'auth/weak-password':
            setErrorMessage('Password is not strong enough. Add additional characters including special characters and numbers.');
          break;
        default:
          setErrorMessage(errorCode);
          break;
      }
    return (
        <p style = {{color:'red'}}>{errorMessage}</p>
  )
}

export default ErrorDisplay