import React, { useEffect, useRef, useState } from 'react';

import Rooms from "./rooms/rooms.component"
import Conversation from './conversation/conversation.components'

import "./_chats-page.scss"

const ChatsPage = () => {

    const pageRef = useRef(null)
    const [width, setWidth] = useState(null)
    const [openRooms, setOpenRooms] = useState(true)

    const [conversation, setConversation] = useState(null)

    useEffect(() => {
        const pageWidth = pageRef.current.offsetWidth
        setWidth(pageWidth)
    }, [])

    return (
        <div className={width <= 768 ? "chats-page small" : "chats-page"} ref={pageRef}>
            <Rooms 
                setConversation={setConversation}  
                conversation={conversation}
                width={width}
                openRooms={openRooms}
                setOpenRooms={setOpenRooms}
            />
            <Conversation 
                conversation={conversation} 
                width={width}
                setOpenRooms={setOpenRooms}
            />
        </div>
    );
};

export default ChatsPage;