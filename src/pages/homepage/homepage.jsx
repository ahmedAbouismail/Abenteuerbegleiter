import React from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';

import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';

import DefaultAvatar from "../../assets/default-avatar.svg"

import "./_homepage.scss"

const Homepage = ({ currentUser }) => {

    return (
        <div className="homepage">
            <div className="left">
                <div className="img-wrap">
                    {currentUser.picUrl ? <img src={currentUser.picUrl} alt="profile-pic" /> :
                        <img src={DefaultAvatar} alt="default-avatar" />}
                </div>
                <h1>{currentUser.displayName}</h1>
            </div>
            <div className="middle">
                sdfsdf
            </div>
            <div className="right">
                löskdjfsdf
            </div>
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
})

export default connect(mapStateToProps)(Homepage);