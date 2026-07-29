import "../../scss/common-classes.scss";
import "../../scss/profile-page.scss";
import i18n from '../../../localisation/i18n';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import messageIcon from '../../assets/icons/icon-messages.png';
import parametersIcon from '../../assets/icons/icon-parameters.png';
import notificationIcon from '../../assets/icons/icon-notifications.png'
import logoutIcon from "../../assets/icons/icon-disconnect.png";
import deFlag from "../../assets/flags/de-flag.png";
import enFlag from "../../assets/flags/en-flag.png";
import frFlag from "../../assets/flags/fr-flag.png";
import ruFlag from "../../assets/flags/ru-flag.png";
import ukFlag from "../../assets/flags/uk-flag.png";


interface User {
    name: string;
    last_name: string;
    email: string;
    pseudo: string;
    file_name: string | null;
}


function HeaderOnline() {
    const [user, setUser] = useState<User | null>(null);
    const { t } = useTranslation();
    useEffect(() => {
        fetch('/api/my-profile', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => setUser(data))
    }, []);

    const navigate = useNavigate();
    const handleLogout = async() => {
        await fetch('/api/logout',{
            method: 'POST',
            credentials: 'include'
        });
        navigate('/login');
    }
     
    if (!user)
        return <p>Chargement...</p>;
    return (
        <>
            <header className="profile-page-header">
                <section className="d-flex align-items-center gap-3">
                    <figure className="m-0" onClick={() => navigate('/PersonalPage')}>
                        <img src={user.file_name ? `/uploads/${user.file_name}` : '/default-avatar.png'} alt="avatar" className="img-avatar-profilePage" />
                    </figure>
                    <div className="d-flex flex-column">
                        <h3>{user.pseudo}</h3>
                        <span>{user.name} {user.last_name}</span>
                    </div>
                </section>
                <section className="ms-auto d-flex gap-1">
                    <span className="lang-choice" onClick={() => { i18n.changeLanguage('fr'); localStorage.setItem('lang', 'fr'); }}>Français</span>
                    <span className="lang-choice" onClick={() => { i18n.changeLanguage('en'); localStorage.setItem('lang', 'en'); }}>English</span>
                    <span className="lang-choice" onClick={() => { i18n.changeLanguage('de'); localStorage.setItem('lang', 'de'); }}>Deutsch</span>
                    <span className="lang-choice" onClick={() => { i18n.changeLanguage('ru'); localStorage.setItem('lang', 'ru'); }}>Русский</span>
                    <span className="lang-choice" onClick={() => { i18n.changeLanguage('uk'); localStorage.setItem('lang', 'uk'); }}>українська</span>
                </section>
                <section className="ms-auto d-flex gap-2">
                    <figure className="m-0 pp-icons-header" data-tooltip={t('common.messages')}>
                        <img src={messageIcon} alt="message-icon" />
                    </figure>
                    <figure className="m-0 pp-icons-header" data-tooltip={t('common.notifications')}>
                        <img src={notificationIcon} alt="notification-icon" />
                    </figure>
                    <figure className="m-0 pp-icons-header" data-tooltip={t('common.parameters')}>
                        <img src={parametersIcon} alt="parameters-icon" />
                    </figure>
                    <figure className="m-0 pp-icons-header" data-tooltip={t('common.logout')} onClick={handleLogout}>
                        <img src={logoutIcon} alt="logout-icon" />
                    </figure>
                </section>
            </header>
        </>
    )
}
export default HeaderOnline;