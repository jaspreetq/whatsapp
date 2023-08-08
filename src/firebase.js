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
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUPruigD8z-Aylt9uiKbQ5EH1TKR1on6w",
  authDomain: "whatsappwithemail.firebaseapp.com",
  projectId: "whatsappwithemail",
  storageBucket: "whatsappwithemail.appspot.com",
  messagingSenderId: "364927015827",
  appId: "1:364927015827:web:f0c4ac1e3a920a8985e666",
  measurementId: "G-EG4P91GCLS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
