import React, { useEffect, useState } from 'react'
import { projectAuth } from "./config"
import { projectFirestore } from "./config"

export const AuthContext = React.createContext()


const collection = projectFirestore.collection("users")

const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        projectAuth.onAuthStateChanged((user) => {
            if (user) {
                collection
                .where("id", "==", user.uid)
                .onSnapshot((query) => {
                    const items = []
                    query.forEach(doc => {
                        items.push(doc.data())
                    })
                    const [userData] = items
                    setCurrentUser(userData)

                })
            }

        })
    }, [])

    // console.log(process.env.NODE_ENV)

    return (
        <AuthContext.Provider
            value={{ currentUser, setCurrentUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider