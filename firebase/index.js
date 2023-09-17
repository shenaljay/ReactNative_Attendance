// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, deleteDoc, updateDoc, getDoc, arrayUnion, arrayRemove, query, where } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_G_z3vQ8JHsckY5jgTZbEWBJtqqjSGc8",
  authDomain: "eventattendance-58ee0.firebaseapp.com",
  projectId: "eventattendance-58ee0",
  storageBucket: "eventattendance-58ee0.appspot.com",
  messagingSenderId: "63370169522",
  appId: "1:63370169522:web:7e5f239f77484a951ccdab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



export { app, db, getFirestore, collection, addDoc, deleteDoc, updateDoc, getDoc, arrayUnion, arrayRemove, query, where};