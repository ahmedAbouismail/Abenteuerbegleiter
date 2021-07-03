import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';

import { projectStorage, projectFirestore, timestamp } from "../../firebase/config";

import "./_progress-bar.styles.scss"

const ProgressBarComponent = ({ file, setFile, currentUser }) => {

    const [progress, setProgress] = useState(0);
    const [url, setUrl] = useState(null);

    useEffect(() => {
        // references 
        const storageRef = projectStorage.ref(currentUser.id + "profile-pic");
        const collectionRef = projectFirestore.collection("users");

        storageRef.put(file).on("state_changed", (snap) => {
            let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
            setProgress(percentage);
        }, (err) => {
            console.log(err);
        }, async () => {
            const picUrl = await storageRef.getDownloadURL();
            const lastUpdate = timestamp();
            collectionRef.doc(currentUser.id).update({ picUrl, lastUpdate })
            setUrl(picUrl);
        });
    }, [file, currentUser.id])

    useEffect(() => {
        if (url) {
            setFile(null)
        }
    }, [url, setFile])

    return (
        <div 
            className="progress-bar"
            style={{width: progress + "%"}}
        >
            <p>{Math.round(progress)}%</p>
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
})

export default connect(mapStateToProps)(ProgressBarComponent);