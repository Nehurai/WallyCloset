// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyCHPBHUuppDh6T_v54p-9JVfobkG479NNo",
  authDomain: "wallycloset-199ad.firebaseapp.com",
  projectId: "wallycloset-199ad",
  storageBucket: "wallycloset-199ad.appspot.com",
  messagingSenderId: "714522480289",
  appId: "1:714522480289:web:f06a5cf7ea99d8ccf92ae0",
  measurementId: "G-HG0PEJPBEB",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 
export const googleProvider = new GoogleAuthProvider();

