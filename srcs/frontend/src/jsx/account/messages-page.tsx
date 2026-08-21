import "../../scss/common-classes.scss";
import "../../scss/messages.scss";
import { useTranslation } from "react-i18next";
import ChatRoom from "./messages-chat-room"
import SideBar from "./messages-sidebar"
import NewChat from "../account/new-chat";
import MesageMore from "./message-more-options"
import MoreOptions from "./message-more-options";
import Block from "./message-block"

function Messages(){
    return(
        <>
            <div className="d-flex">
                <SideBar></SideBar>
                <Block></Block>
                {/* <ChatRoom></ChatRoom> */}
                {/* <NewChat></NewChat> */}
                
                {/* <MoreOptions></MoreOptions> */}
            </div>
            
        </>

    )
}

export default Messages;