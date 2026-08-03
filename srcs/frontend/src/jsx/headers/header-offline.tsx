import "../../scss/common-classes.scss"
import i18n from '../../../localisation/i18n'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function HeaderOffline() {
    const { t } = useTranslation();
    return (
        <header className="common-head d-flex gap-2 p-3">
            <div className="d-none d-md-flex gap-2">
                <input type="button" value="Français" className="btn btn-secondary header-btn btn-sm" onClick={() => { i18n.changeLanguage('fr'); localStorage.setItem('lang', 'fr'); }} />
                <input type="button" value="English" className="btn btn-secondary header-btn btn-sm" onClick={() => { i18n.changeLanguage('en'); localStorage.setItem('lang', 'en'); }} />
                <input type="button" value="Deutsch" className="btn btn-secondary header-btn btn-sm" onClick={() => { i18n.changeLanguage('de'); localStorage.setItem('lang', 'de'); }} />
                <input type="button" value="Русский" className="btn btn-secondary header-btn btn-sm" onClick={() => { i18n.changeLanguage('ru'); localStorage.setItem('lang', 'ru'); }} />
                <input type="button" value="українська" className="btn btn-secondary header-btn btn-sm" onClick={() => { i18n.changeLanguage('uk'); localStorage.setItem('lang', 'uk'); }} />
            </div>
            <div className="dropdown d-md-none">
                <button className="btn btn-secondary btn-sm dropdown-toggle header-btn" type="button" data-bs-toggle="dropdown">
                    Langue
                </button>
                <ul className="dropdown-menu">
                    <li>
                        <input type="button" value="Français" className="btn btn-secondary header-btn btn-sm" onClick={() => { i18n.changeLanguage('fr'); localStorage.setItem('lang', 'fr'); }} />
                    </li>
                    <li>
                        <input type="button" value="English" className="btn btn-secondary header-btn btn-sm" onClick={() => { i18n.changeLanguage('en'); localStorage.setItem('lang', 'en'); }} />
                    </li>
                    <li>
                        <input type="button" value="Deutsch" className="btn btn-secondary header-btn btn-sm" onClick={() => { i18n.changeLanguage('de'); localStorage.setItem('lang', 'de'); }} /></li>
                    <li>
                        <input type="button" value="Русский" className="btn btn-secondary header-btn btn-sm" onClick={() => { i18n.changeLanguage('ru'); localStorage.setItem('lang', 'ru'); }} />
                    </li>
                    <li>
                        <input type="button" value="українська" className="btn btn-secondary header-btn btn-sm" onClick={() => { i18n.changeLanguage('uk'); localStorage.setItem('lang', 'uk'); }} />
                    </li>
                </ul>
            </div>
            <div className="ms-auto d-flex gap-2">
                <Link to="/login" className="btn btn-secondary btn-sm header-btn">{t('common.login')}</Link>
                <Link to="/register" className="btn btn-secondary btn-sm header-btn">{t('common.register')}</Link>
            </div>

        </header>
    );
}
export default HeaderOffline;