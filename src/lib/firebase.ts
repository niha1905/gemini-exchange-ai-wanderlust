// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAma3TZQZJWiIHq4WuYCy2Tjfn984M-DKU",
  authDomain: "wanderlust-20be9.firebaseapp.com",
  projectId: "wanderlust-20be9",
  storageBucket: "wanderlust-20be9.appspot.com",
  messagingSenderId: "79040326630",
  appId: "1:79040326630:web:74bad86f0b040bd3098427",
  measurementId: "G-9N9YEVGZ98"
};

// Initialize Firebase for client-side
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
