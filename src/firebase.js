// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyB7WeYmsnl_A-4cZED8s6TOuPhmjgGAyjg",
//   authDomain: "whatsapp-d9816.firebaseapp.com",
//   projectId: "whatsapp-d9816",
//   storageBucket: "whatsapp-d9816.appspot.com",
//   messagingSenderId: "866401384266",
//   appId: "1:866401384266:web:45d2703674a4d634cfb3b3",
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: "AIzaSyCzFTHle3AFxPknfONeK1g8w6iyKmuuo3M",
  // authDomain: "whatsapp-clone-a01eb.firebaseapp.com",
  // projectId: "whatsapp-clone-a01eb",
  // storageBucket: "whatsapp-clone-a01eb.appspot.com",
  // messagingSenderId: "508048272765",
  // appId: "1:508048272765:web:c5066e5d11713175fa7014",
  // measurementId: "G-9SXFE7SZHX"
  apiKey: "AIzaSyB7WeYmsnl_A-4cZED8s6TOuPhmjgGAyjg",
  authDomain: "whatsapp-d9816.firebaseapp.com",
  projectId: "whatsapp-d9816",
  storageBucket: "whatsapp-d9816.appspot.com",
  messagingSenderId: "866401384266",
  appId: "1:866401384266:web:45d2703674a4d634cfb3b3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getFirestore();
