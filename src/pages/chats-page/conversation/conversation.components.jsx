import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from "uuid"
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../../redux/user/user.selectors';

import { projectFirestore, timestamp } from '../../../firebase/config';

import DefaultAvatar from "../../../assets/default-avatar.svg"
import "./_conversation.styles.scss"

const chats = projectFirestore.collection("chats")

const Conversation = ({ conversation, currentUser }) => {

    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [contactedPerson, setContactedPerson] = useState(null)

    useEffect(() => {
        if (conversation) {
            chats
                .doc(conversation.id)
                .collection("messages")
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    const items = []
                    snapshot.forEach(doc => {
                        items.push(doc.data())
                    })
                    setMessages(items)
                })
            conversation.users.forEach((user, u) => {
                let tempUser = null
                user
                    .get()
                    .then(snap => {
                        tempUser = snap.data()
                        if (tempUser.id !== currentUser.id) {
                            setContactedPerson(tempUser)
                        }
                    })
            })

        }

    }, [conversation, currentUser.id])

    const sendMessage = (e) => {

        const msg = {
            id: uuidv4(),
            createdAt: timestamp(),
            message: message,
            uid: currentUser.id
        }

        if (e.keyCode === 13 || e === "click") {
            chats
                .doc(conversation.id)
                .collection("messages")
                .doc(msg.id)
                .set(msg)
                .then(() => {
                    setMessage("")
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    console.log(contactedPerson);

    return (
        conversation &&
        <div className="conversation">
            <div className="messages">
                {messages && messages.length > 0 && contactedPerson &&
                    messages.map((msg, m) => (
                        <div key={m} className={msg.uid === currentUser.id ? "message right" : "message left"}>
                            <div className={msg.uid === currentUser.id ? "span-msg-name right" : "span-msg-name left"}>
                                <span className="name">{msg.uid === currentUser.id ? "Me" : contactedPerson.displayName}</span>
                                <span className={msg.uid === currentUser.id ? "msg right" : "msg left"}>{msg.message}</span>
                            </div>
                            <div className="img-wrap">
                                {(msg.uid === currentUser.id) ? 
                                    (currentUser.picUrl ? <img src={currentUser.picUrl} alt="profile-pic" /> :
                                    <img src={DefaultAvatar} alt="default-avatar" />) :
                                    (contactedPerson.picUrl ? <img src={contactedPerson.picUrl} alt="profile-pic" />:
                                    <img src={DefaultAvatar} alt="default-avatar" />)}
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="type-msg">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => sendMessage(e)}
                />
                <button
                    className="send-btn"
                    onClick={() => sendMessage("click")}
                >
                    <i className="fas fa-paper-plane fa-2x"></i>
                </button>
            </div>
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
})

export default connect(mapStateToProps)(Conversation);