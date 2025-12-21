// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAyITeBcGPOK3UXGK9u6hq4TZDXp_V-uf8",
    authDomain: "gensavour.firebaseapp.com",
    projectId: "gensavour",
    storageBucket: "gensavour.firebasestorage.app",
    messagingSenderId: "1013186876614",
    appId: "1:1013186876614:web:7f82a172b2ed28997af3c7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
