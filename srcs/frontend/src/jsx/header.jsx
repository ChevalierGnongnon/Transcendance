import "../scss/common-classes.scss"
import i18n from '../../localisation/i18n.js'

function Header(){
    return (
        <header className="common-head d-flex gap-2 p-2">
            <input type="button" value="Français" className="btn btn-secondary btn-sm" onClick={() => { i18n.changeLanguage('fr'); localStorage.setItem('lang', 'fr'); }}/>
            <input type="button" value="English" className="btn btn-secondary btn-sm" onClick={() => {i18n.changeLanguage('en'); localStorage.setItem('lang', 'en'); }}/>
            <input type="button" value="Deutsch" className="btn btn-secondary btn-sm" onClick={() => {i18n.changeLanguage('de'); localStorage.setItem('lang', 'de'); }}/>
            <input type="button" value="Русский" className="btn btn-secondary btn-sm" onClick={() => {i18n.changeLanguage('ru'); localStorage.setItem('lang', 'ru'); }}/>
            <input type="button" value="українська" className="btn btn-secondary btn-sm" onClick={() => {i18n.changeLanguage('uk'); localStorage.setItem('lang', 'uk'); }}/>
        </header>
    );
}

export default Header;