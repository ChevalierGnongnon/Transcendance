import { useTranslation } from "react-i18next";
import "../../scss/messages.scss";

function MoreOptions(){
    const {t} = useTranslation();
    return(
        <div className="more-options-div gap-3 d-flex flex-column justify-content-center align-items-center">
            <input type="button" value={t('message.upload-file')} className="btn btn-primary more-options-btn" />
            <input type="button" value={t('message.invite-to-game')} className="btn btn-primary more-options-btn" />
        </div>
    )

}

export default MoreOptions;

