import React, { useState } from 'react';

import Rooms from "./rooms/rooms.component"
import Conversation from './conversation/conversation.components'

import "./_chats-page.scss"

const ChatsPage = () => {

    const [conversation, setConversation] = useState(null)

    return (
        <div className="chats-page">
            <Rooms 
                setConversation={setConversation}  
                conversation={conversation}
            />
            <Conversation conversation={conversation} />
        </div>
    );
};

export default ChatsPage;