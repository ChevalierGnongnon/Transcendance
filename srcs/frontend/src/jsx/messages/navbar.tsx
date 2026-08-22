import messageIcon from "../../assets/icons/message-60.png"
import moreIcon from "../../assets/icons/plus.png"
import blockIcon from "../../assets/icons/croix.png"
import geminiIcon from "../../assets/icons/gemini.png"
import { useTranslation } from "react-i18next"

function NavBar(){
    const {t} = useTranslation();

    return (
        <div className="p-1 nav-bar">
            <div className="icon-message-message m-2"><img src={messageIcon} alt="messagelist" /></div>
            <span>{t('message.my-messages')}</span>
            <div className="icon-message-message m-2"><img src={moreIcon} alt="newone" /></div>
            <span>{t('message.new-message')}</span>
            <div className="icon-message-message m-2"><img src={blockIcon} alt="block" /></div>
            <span>{t('message.block')}</span>
            <div className="icon-message-message m-2"><img src={geminiIcon} alt="gemini" /></div>
            <span>{t('message.imaginary-friend')}</span>
        </div>
    );
}
export default NavBar;