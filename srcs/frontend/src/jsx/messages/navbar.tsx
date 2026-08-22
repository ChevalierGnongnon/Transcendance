import messageIcon from "../../assets/icons/message-60.png"
import moreIcon from "../../assets/icons/plus.png"
import blockIcon from "../../assets/icons/croix.png"
import geminiIcon from "../../assets/icons/gemini.png"
import { useTranslation } from "react-i18next"

interface NavBarProps {
    activeView: "my messages" | "new message" | "block" | "imaginaryfriend" | "conversation";
    setActiveView: (view: "my messages" | "new message" | "block" | "imaginaryfriend" | "conversation") => void;
}

function NavBar({ activeView, setActiveView }: NavBarProps){
    const {t} = useTranslation();

    return (
        <div className="p-1 nav-bar">
            <div className="icon-message-message m-2" onClick={()=>setActiveView("my messages")}><img src={messageIcon} alt="messagelist" /></div>
            <span onClick={()=>setActiveView("my messages")}>{t('message.my-messages')}</span>
            <div className="icon-message-message m-2" onClick={()=>setActiveView("new message")}><img src={moreIcon} alt="newone" /></div>
            <span onClick={()=>setActiveView("new message")}>{t('message.new-message')}</span>
            <div className="icon-message-message m-2" onClick={()=>setActiveView("block")}><img src={blockIcon} alt="block" /></div>
            <span onClick={()=>setActiveView("block")}>{t('message.block')}</span>
            <div className="icon-message-message m-2" onClick={()=>setActiveView("imaginaryfriend")}><img src={geminiIcon} alt="gemini" /></div>
            <span onClick={()=>setActiveView("imaginaryfriend")}>{t('message.imaginary-friend')}</span>
        </div>
    );
}
export default NavBar;