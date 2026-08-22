import "../../scss/common-classes.scss";
import "../../scss/messages.scss";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import ChatRoom from "./chat-room"
import NavBar from "./navbar"
import NewChat from "./new-chat";
import MoreOptions from "./options";
import Block from "./block"
import MessageList from "./list-messages";

function Messages() {
    const [activeView, setActiveView] = useState<"my messages" | "new message" | "block" | "imaginaryfriend" | "conversation">("my messages")
    return (
        <>
            <NavBar activeView={activeView} setActiveView={setActiveView}></NavBar>
           <div className={activeView !== "my messages" ? "d-flex" : ""}>
                <MessageList align={activeView === "my messages" ? "center" : "left"} setActiveView={setActiveView} />
                {activeView === "conversation" && <ChatRoom />}
                {activeView === "new message" && <NewChat />}
                {activeView === "block" && <Block />}
                {activeView === "imaginaryfriend" && <MoreOptions />}
            </div>
        </>
 
    )
}

export default Messages;