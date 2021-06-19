import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link, useHistory } from "react-router-dom";

import { selectCurrentUser } from '../../redux/user/user.selectors';

import { projectAuth } from "../../firebase/config";

import { ReactComponent as Logo } from "../../assets/logo.svg";
import "./_navbar.styles.scss";
import { setCurrentUser } from '../../redux/user/user.actions';


const Navbar = ({ currentUser, setCurrentUser }) => {

    const history = useHistory();

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

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
})

const mapDispatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);