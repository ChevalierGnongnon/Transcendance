import "../../scss/common-classes.scss";
import "../../scss/messages.scss";
import { useTranslation } from "react-i18next";
import ChatRoom from "./messages-chat-room"
import NavBar from "./messages-navbar"
import NewChat from "../account/new-chat";
import MesageMore from "./message-more-options"
import MoreOptions from "./message-more-options";
import Block from "./message-block"
import MessageList from "./messages-list";

function Messages() {
    return (
        <>
            <NavBar></NavBar>
            {/* <MessageList></MessageList> */}
            {/* <Block></Block> */}
            <ChatRoom></ChatRoom>
            {/* <NewChat></NewChat> */}

            {/* <MoreOptions></MoreOptions> */}
        </>

    )
}

export default Messages;