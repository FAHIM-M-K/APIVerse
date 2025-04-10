import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase config (from Step 4, Firebase Project Settings)
const firebaseConfig = {
    apiKey: "AIzaSyAC_roXLUTT90OqdmRPkAQH833kSijWuEo",
    authDomain: "apiverse-huma.firebaseapp.com",
    projectId: "apiverse-huma",
    storageBucket: "apiverse-huma.firebasestorage.app",
    messagingSenderId: "970662891138",
    appId: "1:970662891138:web:49eab0a727df9a26066e9b",
    databaseURL: "https://apiverse-huma.firebaseio.com"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();