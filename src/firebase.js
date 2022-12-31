
import { initializeApp } from "firebase/app";  // function used to iniitalize the firebase app
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {    //to connect the firebase project with react
  apiKey: "AIzaSyBF2Tg7ugVQkmMNin2BO9RJ2-OWl6XsiDY",
  authDomain: "chit-chat-bbfa3.firebaseapp.com",
  projectId: "chit-chat-bbfa3",
  storageBucket: "chit-chat-bbfa3.appspot.com",
  messagingSenderId: "600877209002",
  appId: "1:600877209002:web:0c4b15b4dcc6fcac5307d3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);   // firebase app is now connected to firebase account
export const auth = getAuth();  // auth instance is created