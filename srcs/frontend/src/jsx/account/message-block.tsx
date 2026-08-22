import { useTranslation } from "react-i18next";
import "../../scss/common-classes.scss";
import "../../scss/messages.scss";

function Block(){
    const {t} = useTranslation();

    return (
        <form className="form-new-chat py-3 mx-auto my-2 gap-3 d-flex flex-column justify-content-center align-items-center">
            <h1>{t('message.block')}</h1>
            <input type="search" name="search-recipient" id="search-recipient" className="search-input" placeholder={t('common.search-user')}/>
            <input type="button" value={t('common.search')} className="new-msg-button btn btn-primary" />
            <h1>{t('message.give-reason')}</h1>
            <textarea name="message" id="message" className="new-message"></textarea>
            <input type="button" value={t('message.block')} className="new-msg-button btn btn-primary"/>
        </form>
    );
}

export default Block;