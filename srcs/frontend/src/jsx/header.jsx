import "../scss/common-classes.scss"
import i18n from '../../localisation/i18n.js'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function Header(){
    const {t} = useTranslation();
    return (
        <header className="common-head d-flex gap-2 p-2">
            <input type="button" value="Français" className="btn btn-secondary btn-sm" onClick={() => { i18n.changeLanguage('fr'); localStorage.setItem('lang', 'fr'); }}/>
            <input type="button" value="English" className="btn btn-secondary btn-sm" onClick={() => {i18n.changeLanguage('en'); localStorage.setItem('lang', 'en'); }}/>
            <input type="button" value="Deutsch" className="btn btn-secondary btn-sm" onClick={() => {i18n.changeLanguage('de'); localStorage.setItem('lang', 'de'); }}/>
            <input type="button" value="Русский" className="btn btn-secondary btn-sm" onClick={() => {i18n.changeLanguage('ru'); localStorage.setItem('lang', 'ru'); }}/>
            <input type="button" value="українська" className="btn btn-secondary btn-sm" onClick={() => {i18n.changeLanguage('uk'); localStorage.setItem('lang', 'uk'); }}/>
            <div className="ms-auto d-flex gap-2">
                <Link to="/login" className="btn btn-secondary btn-sm">{t('login.button')}</Link>
                <Link to="/register" className="btn btn-secondary btn-sm">{t('register.button')}</Link>
            </div>
        </header>
    );
}

export default Header;