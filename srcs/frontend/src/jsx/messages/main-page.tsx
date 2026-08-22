import "../../scss/common-classes.scss";
import "../../scss/messages.scss";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import ChatRoom from "./chat-room"
import NavBar from "./navbar"
import NewChat from "./new-chat";
import MesageMore from "./options"
import MoreOptions from "./options";
import Block from "./block"
import MessageList from "./list-messages";

function Messages() {
    const [activeView, setActiveView] = useState<"my messages" | "new message" | "block" | "imaginaryfriend">("my messages")
    return (
        <>
            <NavBar></NavBar>
            <MessageList></MessageList>
            <Block></Block>
            <ChatRoom></ChatRoom>
            <NewChat></NewChat>
            <MoreOptions></MoreOptions>
        </>
 
    )
}

export default Messages;