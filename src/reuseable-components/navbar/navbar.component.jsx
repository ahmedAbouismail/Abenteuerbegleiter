import React, { useContext } from 'react';

import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../../firebase/auth";
import { projectAuth } from "../../firebase/config";
import { ReactComponent as Logo } from "../../assets/logo.svg";

import "./_navbar.styles.scss";

const Navbar = () => {

    const history = useHistory();
    const { currentUser, setCurrentUser } = useContext(AuthContext)

    const signOut = () => {
        projectAuth.signOut()
            .then(() => {
                setCurrentUser(null)
                history.push("/")
            })
            .catch(err => {
                console.error(err)
            })

    }

    return (
        <div className="navbar">
            <Link className="logo-wrap" to="/">
                <Logo className="logo" />
            </Link>
            <div className="menus">
                <Link className="menu" to="/about">About</Link>
                {currentUser &&
                    <span onClick={signOut} className="menu">Logout</span>}
            </div>
        </div>
    );
};

export default Navbar;