// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'


import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID
// };

const firebaseConfig = {
  apiKey: "AIzaSyD0oMDhgeJuGlmQbaf6BZ5vT3rQcygjPvI",
  authDomain: "butlr-65ff6.firebaseapp.com",
  projectId: "butlr-65ff6",
  storageBucket: "butlr-65ff6.appspot.com",
  messagingSenderId: "5013400962",
  appId: "1:5013400962:web:65fa4422f53a6cbf7cb39b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app
