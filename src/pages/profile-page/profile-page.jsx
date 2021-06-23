import React, { useState } from 'react';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';

import { projectFirestore, timestamp } from '../../firebase/config';

import ProgressBarComponent from '../../reuseable-components/progress-bar/progress-bar.component';
import DefaultAvatar from "../../assets/default-avatar.svg"

import "./_profile-page.scss"

const users = projectFirestore.collection("users")
const lastUpdate = timestamp()

const ProfilePage = ({ currentUser }) => {

    const [displayName, setDisplayName] = useState({
        edit: false,
        value: currentUser.displayName ? currentUser.displayName : ""
    })
    const [email, setEmail] = useState({
        edit: false,
        value: currentUser.email ? currentUser.email : ""
    })
    const [phoneNumber, setPhoneNumber] = useState({
        edit: false,
        value: currentUser.phoneNumber ? currentUser.phoneNumber : ""
    })
    const [desc, setDesc] = useState({
        edit: false,
        value: currentUser.desc ? currentUser.desc : ""
    })
    const [picHover, setPicHover] = useState(false)
    const [file, setFile] = useState(null)
    const [error, setError] = useState("")

    const TYPES = ["image/png", "image/jpeg"]

    const changeDisplayName = () => {
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

    const changeEmail = () => {
        users.doc(currentUser.id)
            .update({ email: email.value, lastUpdate })
            .catch(err => {
                console.log(err);
            })
    }

    const changePhoneNumber = () => {
        users.doc(currentUser.id)
            .update({ phoneNumber: phoneNumber.value, lastUpdate })
            .catch(err => {
                console.log(err);
            })
    }

    const changeDesc = () => {
        users.doc(currentUser.id)
            .update({ desc: desc.value, lastUpdate })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div className="profile-page">
            {error &&
                <div className="error">
                    <span>{error}</span>
                    <span onClick={() => setError("")}>X</span>
                </div>
            }
            <div className="ground">

            </div>
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
                        {currentUser.picUrl ? <img src={currentUser.picUrl} alt="profile-pic" /> :
                            <img src={DefaultAvatar} alt="default-avatar" />}
                    </div>
                    {file &&
                        <ProgressBarComponent file={file} setFile={setFile} />
                    }
                    {displayName.edit && <i className="far fa-edit edit-display-name"></i>}
                    <textarea
                        className="display-name"
                        value={displayName.value}
                        onChange={(e) => setDisplayName(prev => ({ ...prev, value: e.target.value }))}
                        onBlur={changeDisplayName}
                        onMouseOver={() => setDisplayName(prev => ({ ...prev, edit: true }))}
                        onMouseLeave={() => setDisplayName(prev => ({ ...prev, edit: false }))}
                        onFocus={() => setDisplayName(prev => ({ ...prev, edit: false }))}
                    >
                    </textarea>

                </div>
                <div className="right-side">
                    <div className="email-div">
                        <input
                            className="email"
                            type="email"
                            placeholder="Email"
                            value={email.value}
                            onChange={(e) => setEmail(prev => ({ ...prev, value: e.target.value }))}
                            onBlur={changeEmail}
                            onMouseOver={() => setEmail(prev => ({ ...prev, edit: true }))}
                            onMouseLeave={() => setEmail(prev => ({ ...prev, edit: false }))}
                            onFocus={() => setEmail(prev => ({ ...prev, edit: false }))}
                        />
                        {email.edit && <i className="far fa-edit edit-display-name"></i>}
                    </div>
                    <div className="phone-div">
                        <input
                            className="phone"
                            type="tel"
                            placeholder="Phone Number"
                            value={phoneNumber.value}
                            onChange={(e) => setPhoneNumber(prev => ({ ...prev, value: e.target.value }))}
                            onBlur={changePhoneNumber}
                            onMouseOver={() => setPhoneNumber(prev => ({ ...prev, edit: true }))}
                            onMouseLeave={() => setPhoneNumber(prev => ({ ...prev, edit: false }))}
                            onFocus={() => setPhoneNumber(prev => ({ ...prev, edit: false }))}
                        />
                        {phoneNumber.edit && <i className="far fa-edit edit-display-name"></i>}
                    </div>
                    <div className="desc-div">
                        <textarea
                            className="desc"
                            placeholder="Description"
                            rows="5"
                            value={desc.value}
                            onChange={(e) => setDesc(prev => ({ ...prev, value: e.target.value }))}
                            onBlur={changeDesc}
                            onMouseOver={() => setDesc(prev => ({ ...prev, edit: true }))}
                            onMouseLeave={() => setDesc(prev => ({ ...prev, edit: false }))}
                            onFocus={() => setDesc(prev => ({ ...prev, edit: false }))}
                        >
                        </textarea>
                        {desc.edit && <i className="far fa-edit edit-display-name"></i>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
})

export default connect(mapStateToProps)(ProfilePage);