// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };

// const firebaseApp = firebase.initializeApp(firebaseConfig);
// export const auth = firebaseApp.auth();
// export const db = firebaseApp.firestore();


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
  apiKey: "AIzaSyDlOcSIeHYH2DeanA6m1SANkW6vMlQkZMQ",
  authDomain: "student-management-d098f.firebaseapp.com",
  projectId: "student-management-d098f",
  storageBucket: "student-management-d098f.firebasestorage.app",
  messagingSenderId: "373625554887",
  appId: "1:373625554887:web:e851cfd448402e0c537be2",
  measurementId: "G-GE06BGEWNC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Modular SDK exports
export const auth = getAuth(app);
export const db = getFirestore(app);
