import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link, useHistory } from "react-router-dom";

import { selectCurrentUser } from '../../redux/user/user.selectors';
import { setCurrentUser } from '../../redux/user/user.actions';

import { projectAuth } from "../../firebase/config";

import { ReactComponent as Logo } from "../../assets/logo.svg";
import DefaultAvatar from "../../assets/default-avatar.svg"
import "./_navbar.styles.scss";


const Navbar = ({ currentUser, setCurrentUser }) => {

    const history = useHistory();
    const [openDropdown, setOpenDropdown] = useState(false)

    const signOut = () => {
        projectAuth.signOut()
            .then(() => {
                setCurrentUser(null)
                setOpenDropdown(false)
                history.push("/")
            })
            .catch(err => {
                console.error(err)
            })

    }

    const toProfile = () => {
        setOpenDropdown(false)
        history.push("/profile")
    }

    const toMessages = () => {
        setOpenDropdown(false)
        history.push("/chats")
    }

    return (
        <div className="navbar">
            <Link className="logo-wrap" to="/" onClick={() => setOpenDropdown(false)}>
                <Logo className="logo" />
            </Link>
            <div className="menus">
                <Link className="menu" to="/about">About</Link>
                {currentUser &&
                    <div className="header-dropdown"
                        onClick={() => setOpenDropdown(prev => !prev)}>
                        <div className="img-wrap">
                            {currentUser.picUrl ? <img src={currentUser.picUrl} alt="profile-pic" /> :
                                <img src={DefaultAvatar} alt="default-avatar" />}
                        </div>
                        <i className={openDropdown ?
                            "fas fa-caret-down rotate" :
                            "fas fa-caret-down"}>
                        </i>
                    </div>
                }
            </div>
            {openDropdown &&
                <div className="dropdown-menus">
                    <div className="dropdown-menu" onClick={toProfile}>
                        <i className="fas fa-user-circle"></i>
                        <span>Profile</span>
                    </div>
                    <div className="dropdown-menu" onClick={toMessages}>
                        <i className="far fa-comments"></i>
                        <span>Chats</span>
                    </div>
                    <div className="dropdown-menu" onClick={signOut}>
                        <i className="fas fa-door-open"></i>
                        <span>Logout</span>
                    </div>
                </div>}
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