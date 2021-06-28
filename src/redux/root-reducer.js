import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";

import userReducer from "./user/user.reducer";

const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    user: userReducer
})

export default rootReducer