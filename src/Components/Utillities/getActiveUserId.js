import { auth } from "../../firebase";
import React from 'react'

function getActiveUserId() {
  return auth.currentUser.uid;
}

export default getActiveUserId