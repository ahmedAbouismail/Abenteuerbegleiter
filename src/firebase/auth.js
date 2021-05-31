import React, { useEffect, useState } from 'react'
import { projectAuth } from "./config"

export const AuthContext = React.createContext()

const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        projectAuth.onAuthStateChanged((user) => {
            setCurrentUser(user)
        })
    }, [])

    console.log(currentUser)



    return (
        <AuthContext.Provider
            value={{ currentUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider