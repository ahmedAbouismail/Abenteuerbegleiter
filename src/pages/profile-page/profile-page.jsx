import React, { useState } from 'react';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';

import { projectFirestore, timestamp } from '../../firebase/config';

import ProgressBarComponent from '../../reuseable-components/progress-bar/progress-bar.component';
import DefaultAvatar from "../../assets/default-avatar.svg"

import "./_profile-page.scss"

const users = projectFirestore.collection("users")

const ProfilePage = ({ currentUser }) => {

    const [displayName, setDisplayName] = useState({
        edit: false,
        value: currentUser.displayName
    })
    const [picHover, setPicHover] = useState(false)
    const [file, setFile] = useState(null)
    const [error, setError] = useState("")

    const TYPES = ["image/png", "image/jpeg"]

    const changeDisplayName = () => {
        const lastUpdate = timestamp()
        users.doc(currentUser.id)
            .update({ displayName: displayName.value, lastUpdate })
            .catch(err => {
                console.log(err);
            })
    }

    const changeProfilePicture = (e) => {
        const selectedFile = e.target.files[0]

        if (selectedFile && TYPES.includes(selectedFile.type)) {
            setFile(selectedFile);
            setError("");
        } else {
            setFile(null);
            setError("Please select an image file (png or jpeg)");
        }
    }

    return (
        <div className="profile-page">
            {error &&
                <div className="error">
                    <span>{error}</span>
                    <span onClick={() => setError("")}>X</span>
                </div>
            }
            <div className="edit-profile">
                <div className="left-side">
                    <div className={"img-wrap"}
                        onMouseOver={() => setPicHover(true)}
                        onMouseLeave={() => setPicHover(false)}>
                        {picHover &&
                            <label>
                                <input type="file" onChange={changeProfilePicture} />
                                <i className="far fa-edit fa-2x"></i>
                            </label>}
                        {currentUser.picUrl ? <img src={currentUser.picUrl} alt="test" /> :
                            <img src={DefaultAvatar} alt="default-avatar" />}
                    </div>
                    {file &&
                        <ProgressBarComponent file={file} setFile={setFile} />
                    }
                    {displayName.edit && <i className="far fa-edit edit-display-name"></i>}
                    <textarea
                        className="display-name"
                        value={displayName.value}
                        onChange={(e) => setDisplayName(prev => ({...prev, value: e.target.value}))}
                        onBlur={changeDisplayName}
                        onMouseOver={() => setDisplayName(prev => ({...prev, edit: true}))}
                        onMouseLeave={() => setDisplayName(prev => ({...prev, edit: false}))}
                        onFocus={() => setDisplayName(prev => ({...prev, edit: false}))}
                    >
                    </textarea>

                </div>
                <div className="right-side">

                </div>
            </div>
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
})

export default connect(mapStateToProps)(ProfilePage);