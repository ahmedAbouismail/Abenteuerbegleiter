import React, { useState } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';

import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';

import DefaultAvatar from "../../assets/default-avatar.svg"
import Post from '../../reuseable-components/post/post'
import "./_homepage.scss"

const Homepage = ({ currentUser }) => {

    const [searchLoc, setSearchLoc] = useState("")

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
                <input 
                    className="search-location"
                    value={searchLoc}
                    onChange={(e) => setSearchLoc(e.target.value)}
                    placeholder="Search for a place"
                />
                <div className="posts">
                    <Post searchLoc={searchLoc} />
                </div>
            </div>
            <div className="right">

            </div>
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
})

export default connect(mapStateToProps)(Homepage);