// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCBxS5fRBBABVpgUCl9RHObejUbK8tlWk",
  authDomain: "my-food-tracker-4bc35.firebaseapp.com",
  projectId: "my-food-tracker-4bc35",
  storageBucket: "my-food-tracker-4bc35.firebasestorage.app",
  messagingSenderId: "519320265338",
  appId: "1:519320265338:web:b7619a55beee85df8551c3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);