import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"
import "firebase/auth"

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const projectStorage = firebase.storage();
export const projectFirestore = firebase.firestore();
export const projectAuth = firebase.auth();
export const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export const createUserDatabase = (user) => {
    const collection = projectFirestore.collection("users")
    collection
        .doc(user.id)
        .set(user)
        .catch(err => {
            console.error(err)
        })
}

const provider = new firebase.auth.GoogleAuthProvider()
provider.setCustomParameters({ prompt: "select_account" })
export const signInWithGoogle = () => {
    projectAuth
        .signInWithPopup(provider)
        .then(async data => {
            const userRef = projectFirestore.doc(`users/${data.user.uid}`)
            const snapShot = await userRef.get()
            if (!snapShot.exists) {
                const displayName = data.user.displayName,
                    email = data.user.email,
                    id = data.user.uid
                createUserDatabase({ displayName, email, id })
            }

        })
        .catch(err => {
            console.log(err);
        })
}


