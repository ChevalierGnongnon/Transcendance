import messageIcon from "../../assets/icons/message-60.png"
import moreIcon from "../../assets/icons/plus.png"
import blockIcon from "../../assets/icons/croix.png"
import geminiIcon from "../../assets/icons/gemini.png"
import { useTranslation } from "react-i18next"

function SideBar(){
    const {t} = useTranslation();

    return (
        <div className="d-flex flex-column align-items-center justify-content-start gap-4 sidebar-nav py-3 m-2 side-bar px-2">
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
export default SideBar;