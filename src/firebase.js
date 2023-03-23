// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzFTHle3AFxPknfONeK1g8w6iyKmuuo3M",
  authDomain: "whatsapp-clone-a01eb.firebaseapp.com",
  projectId: "whatsapp-clone-a01eb",
  storageBucket: "whatsapp-clone-a01eb.appspot.com",
  messagingSenderId: "508048272765",
  appId: "1:508048272765:web:c5066e5d11713175fa7014",
  measurementId: "G-9SXFE7SZHX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);