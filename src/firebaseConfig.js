// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAypTnSmvYNUaL368zjP2y24cPQf8JSCu0",
  authDomain: "erettsegizzunk.firebaseapp.com",
  projectId: "erettsegizzunk",
  storageBucket: "erettsegizzunk.firebasestorage.app",
  messagingSenderId: "787983232445",
  appId: "1:787983232445:web:7d82edc92f75ec6215b6d4",
  measurementId: "G-FE5QZ3JJ8E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signInWithRedirect };