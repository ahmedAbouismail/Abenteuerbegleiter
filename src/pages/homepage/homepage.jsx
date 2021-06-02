import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from "../../firebase/auth"

const Homepage = () => {

    const { currentUser } = useContext(AuthContext)

    const style = {
        paddingTop: "70px"
    }

    return (
        <div className="homepage" style={style}>
            <h1>Hello {currentUser.displayName}</h1>
            <Link to="/profile">Profile</Link>
        </div>
    );
};

export default Homepage;