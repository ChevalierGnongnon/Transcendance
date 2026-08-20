import messageIcon from "../../assets/icons/message-60.png"
import moreIcon from "../../assets/icons/plus.png"
import blockIcon from "../../assets/icons/croix.png"

function SideBar(){
    return (
        <div className="d-flex flex-column align-items-center justify-content-start gap-4 sidebar-nav py-3 m-2 side-bar px-2">
            <div className="icon-message-message m-2"><img src={messageIcon} alt="messagelist" /></div>
            <span>Mes messages</span>
            <div className="icon-message-message m-2"><img src={moreIcon} alt="newone" /></div>
            <span>Nouveau message</span>
            <div className="icon-message-message m-2"><img src={blockIcon} alt="block" /></div>
            <span>Bloquer</span>
            <div className="icon-message-message m-2"><img src={blockIcon} alt="block" /></div>
            <span>Gemini</span>
        </div>
    );
}
export default SideBar;