import React from 'react';

import { Link } from "react-router-dom";

import { ReactComponent as Logo } from "../../assets/logo.svg";

import "./_navbar.styles.scss";

const Navbar = () => {
    return (
        <div className="navbar">
            <Link className="logo-wrap" to="/">
                <Logo className="logo" />
            </Link>
            <div className="menus">
                <Link className="menu" to="/about">About</Link>
            </div>
        </div>
    );
};

export default Navbar;