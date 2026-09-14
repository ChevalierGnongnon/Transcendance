import "../../scss/common-classes.scss"
import i18n from '../../../localisation/i18n'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { isCompositeComponent } from "react-dom/test-utils";
import langIcon from "../../assets/icons/lang_icon.png"

function HeaderOffline() {
    const { t } = useTranslation();
    return (
        <header className="common-head d-flex gap-2 p-3">
    
            <div className="ms-auto d-flex gap-2">
                <div className="dropdown pp-icons-header">
                    <button
                        className="dropdown-toggle lang-btn"
                        type="button"
                        data-bs-toggle="dropdown"
                    >
                        <img src={langIcon} alt="language-icon" className="lang-icon" />
                    </button>


                    <ul className="dropdown-menu">
                        <li><input type="button" value="Fr" className="btn btn-secondary header-btn btn-sm" onClick={() => { i18n.changeLanguage('fr'); localStorage.setItem('lang', 'fr'); }} /></li>
                        <li><input type="button" value="Eng" className="btn btn-secondary header-btn btn-sm" onClick={() => { i18n.changeLanguage('en'); localStorage.setItem('lang', 'en'); }} /></li>
                        <li><input type="button" value="De" className="btn btn-secondary header-btn btn-sm" onClick={() => { i18n.changeLanguage('de'); localStorage.setItem('lang', 'de'); }} /></li>
                        <li><input type="button" value="Ru" className="btn btn-secondary header-btn btn-sm" onClick={() => { i18n.changeLanguage('ru'); localStorage.setItem('lang', 'ru'); }} /></li>
                        <li><input type="button" value="Ua" className="btn btn-secondary header-btn btn-sm" onClick={() => { i18n.changeLanguage('uk'); localStorage.setItem('lang', 'uk'); }} /></li>
                    </ul>
                </div>

                <Link to="/login" className="btn btn-secondary btn-sm header-btn">{t('common.login')}</Link>
                <Link to="/register" className="btn btn-secondary btn-sm header-btn">{t('common.register')}</Link>
            </div>

        </header>
    );
}
export default HeaderOffline;