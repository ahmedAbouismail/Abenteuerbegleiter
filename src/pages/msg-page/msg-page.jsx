import React from 'react';

import Rooms from "./rooms/rooms.component"
import Conversation from './conversation/conversation.components'

import "./_msg-page.scss"

const MsgPage = () => {

    return (
        <div className="msg-page">
            <Rooms />
            <Conversation />
        </div>
    );
};

export default MsgPage;