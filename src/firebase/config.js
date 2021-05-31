import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAcSOYEs3DbDIUkQFkD_ej8UTeU0WYiUoM",
    authDomain: "abenteuerbegleiter.firebaseapp.com",
    projectId: "abenteuerbegleiter",
    storageBucket: "abenteuerbegleiter.appspot.com",
    messagingSenderId: "567318583336",
    appId: "1:567318583336:web:7898dce4d272d3e5fb7d1d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const projectStorage = firebase.storage();
export const projectFirestore = firebase.firestore();
export const projectAuth = firebase.auth();
export const timestamp = firebase.firestore.FieldValue.serverTimestamp;


