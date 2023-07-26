import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBxu_7vriZr_HochNOZmK64QTsbm4UhyZA",
  authDomain: "away-app-31140.firebaseapp.com",
  projectId: "away-app-31140",
  storageBucket: "away-app-31140.appspot.com",
  messagingSenderId: "658063917261",
  appId: "1:658063917261:web:69b34a8bbbf7f52ad0a984",
};

// const app = initializeApp(firebaseConfig);
// // For more information on how to access Firebase in your project,
// // see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

// export default app;

export const FIREBASE_APP =
  getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
