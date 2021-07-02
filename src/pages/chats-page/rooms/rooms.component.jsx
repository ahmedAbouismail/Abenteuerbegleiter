import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from "uuid"

import { projectFirestore, timestamp } from '../../../firebase/config';

import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../../redux/user/user.selectors';

import DefaultAvatar from "../../../assets/default-avatar.svg"
import "./_rooms.styles.scss"

const users = projectFirestore.collection("users")
const chatRooms = projectFirestore.collection("chatRooms")
const chats = projectFirestore.collection("chats")

const Rooms = ({
    currentUser,
    setConversation,
    conversation,
    openRooms,
    setOpenRooms,
    width
}) => {

    const [foundAccounts, setFoundAccounts] = useState([])
    const [name, setName] = useState("")
    const [rooms, setRooms] = useState([])
    const [contactedPeople, setContactedPeople] = useState([])

    useEffect(() => {
        chatRooms
            .where("uids", "array-contains", currentUser.id)
            .orderBy("lastUpdate", "desc")
            .onSnapshot((querySnapshot) => {
                let items = []
                querySnapshot.forEach((doc) => {
                    const data = doc.data()
                    items.push(data)
                })
                setRooms(items)
            })
    }, [currentUser.id])

    useEffect(() => {
        const people = []
        rooms.forEach((room, r) => {
            room.users.forEach((user, u) => {
                let tempUser = null
                user.get()
                    .then(snap => {
                        tempUser = snap.data()

                        if (tempUser && tempUser.id !== currentUser.id) {
                            people.push(tempUser)
                        }

                        if (u === room.users.length - 1 && r === rooms.length - 1) {
                            setContactedPeople(people) // set must be in the .then()
                        }
                    })
            })
        })
    }, [rooms, currentUser.id])

    const searchAccount = (e) => {
        const tempName = e.target.value
        setName(tempName)

        users
            .where("displayName", "==", tempName)
            .onSnapshot((querySnapshot) => {
                const items = [];
                querySnapshot.forEach(doc => {
                    items.push(doc.data())
                })
                setFoundAccounts(items)
            })
    }

    const selectUserToChatWith = (otherAccount) => {
        const room = {
            users: [users.doc(currentUser.id), users.doc(otherAccount.id)],
            uids: [currentUser.id, otherAccount.id],
            lastUpdate: timestamp(),
            id: uuidv4()
        }
        if (rooms && rooms.length > 0) {
            let exist = false
            let existingRoom = null
            for (let index = 0; index < rooms.length; index++) {
                if (rooms[index].uids.includes(currentUser.id) && rooms[index].uids.includes(otherAccount.id)) {
                    exist = true
                    existingRoom = rooms[index]
                    break
                }
            }
            console.log(exist);
            if (!exist) {
                chatRooms
                    .doc(room.id)
                    .set(room)
                    .then(() => {
                        setName("")
                    })
                    .catch(err => {
                        console.log(err);
                    })
                chats
                    .doc(room.id)
                    .set({ id: room.id })
                    .catch(err => {
                        console.log(err);
                    })
                setConversation(room)
            } else {
                setConversation(existingRoom)
                setName("")
            }
        } else {
            console.log("room zero");
            chatRooms
                .doc(room.id)
                .set(room)
                .then(() => {
                    setName("")
                })
                .catch(err => {
                    console.log(err);
                })
            chats
                .doc(room.id)
                .set({ id: room.id })
                .catch(err => {
                    console.log(err);
                })
            setConversation(room)
        }
    }

    const getPerson = (uids) => {
        const [otherId] = uids.filter(item => item !== currentUser.id)
        const [person] = contactedPeople.filter(item => item.id === otherId)
        return person
    }

    const selectChatRoom = (room) => {
        setConversation(room)
        setOpenRooms(false)
    }

    return (
        <div className={width <= 768 ? openRooms ? "rooms small" : "rooms small hidden" : "rooms"}>
            {(width <= 768 && conversation) &&
                <div className="close-rooms" onClick={() => setOpenRooms(false)}>
                    <i className="fas fa-chevron-left fa-2x"></i>
                    <span>Close</span>
                </div>}
            <div className={width <= 768 ? "search-div small" : "search-div"}>
                <div className="search">
                    <input
                        placeholder="Search for username..."
                        value={name}
                        onChange={searchAccount}
                    />
                    {name && <span onClick={() => setName("")}>X</span>}
                </div>
                <div className="found-accounts">
                    {(name) && (
                        (foundAccounts && foundAccounts.length > 0) ?
                            foundAccounts.map((account, a) => (
                                <div
                                    className="account"
                                    key={a}
                                    onClick={() => selectUserToChatWith(account)}
                                >
                                    <span>{account.displayName}</span>
                                    <div className="img-wrap">
                                        {account.picUrl ? <img src={account.picUrl} alt="profile-pic" /> :
                                            <img src={DefaultAvatar} alt="default-avatar" />}
                                    </div>
                                </div>
                            )) :
                            <div className="account">User not found</div>)
                    }
                </div>
            </div>
            <div className={width <= 768 ? "conversations-collection small" : "conversations-collection"}>
                {(contactedPeople && contactedPeople.length > 0 && contactedPeople.length === rooms.length) ?
                    rooms.map((room, r) => (
                        <div
                            className={(conversation && conversation.id === room.id) ? "room selected" : "room"}
                            key={r}
                            onClick={() => selectChatRoom(room)}
                        >
                            <span>
                                {
                                    room.uids && getPerson(room.uids).displayName.substr(0, 10)
                                }
                            </span>
                            <div className="img-wrap">
                                {getPerson(room.uids).picUrl ?
                                    <img src={getPerson(room.uids).picUrl} alt="profile-pic" /> :
                                    <img src={DefaultAvatar} alt="default-avatar" />}
                            </div>
                        </div>
                    )) :
                    <div>
                        No chat rooms yet
                    </div>}
            </div>
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
})

export default connect(mapStateToProps)(Rooms);