// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);