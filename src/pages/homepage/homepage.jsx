import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';

const Homepage = ({ currentUser }) => {

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

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
})

export default connect(mapStateToProps)(Homepage);