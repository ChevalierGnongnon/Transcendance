import "../scss/common-classes.scss"
import i18n from '../../localisation/i18n.js'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function PersonalPage() {
    const {t} = useTranslation();

    return (
        
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <form className="login-form d-flex flex-column align-items-center gap-3">
                <h1 className="login-title">{t('profile-page.title')}</h1>
            </form>
        </div>
    );
}
export default PersonalPage;