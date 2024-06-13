// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKm7qt8DHDRiFMHmCLOKvDWQGZKAuaL7A",
  authDomain: "ai-stockscope.firebaseapp.com",
  projectId: "ai-stockscope",
  storageBucket: "ai-stockscope.appspot.com",
  messagingSenderId: "1045500804149",
  appId: "1:1045500804149:web:c3a34f04fa9c591f78457c",
  measurementId: "G-X145YN35W1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);