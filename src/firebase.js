// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdSsNOG6JRdEGKAsuac1Pyoizxw__YiV0",
  authDomain: "chatspace-c6dba.firebaseapp.com",
  databaseURL: "https://chatspace-c6dba-default-rtdb.firebaseio.com",
  projectId: "chatspace-c6dba",
  storageBucket: "chatspace-c6dba.appspot.com",
  messagingSenderId: "132222922125",
  appId: "1:132222922125:web:3231e42d010bf9a33ba1c4",
  measurementId: "G-ZLW362NZ3M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
// export const auth = getAuth(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
signOut(auth).then(() => {
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});
export { signOut };
const database = getDatabase(app);
export const firestore= getFirestore(app);
export { database }; // Export the database reference so you can use it in other components