import "../../scss/common-classes.scss";
import { useTranslation } from "react-i18next";
import ChatRoom from "./messages-chat-room"
import SideBar from "./message-sidebar"

function Messages(){
    return(
        <>
            <div className="d-flex">
                <SideBar></SideBar>
                <ChatRoom></ChatRoom>
            </div>
        </>

    )
}

export default Messages;