import "../../scss/common-classes.scss";
import { useTranslation } from "react-i18next";
import ChatRoom from "./messages-chat-room"
import SideBar from "./messages-sidebar"
import NewChat from "../account/new-chat";

function Messages(){
    return(
        <>
            <div className="d-flex">
                <SideBar></SideBar>
                {/* <ChatRoom></ChatRoom> */}
                <NewChat></NewChat>
            </div>
            
        </>

    )
}

export default Messages;