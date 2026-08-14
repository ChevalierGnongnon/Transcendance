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
import myPageIcon from "../../assets/icons/icon-my-page.png"
import { isCompositeComponent } from "react-dom/test-utils";


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
    const handleLogout = async () => {
        await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        navigate('/login');
    }

    if (!user)
        return <p>Chargement...</p>;
    return (
        <>
            <header className="profile-page-header py-3 px-4">
                <section className="d-none d-md-flex header-left d-flex align-items-center gap-3">
                    <figure className="m-0" onClick={() => navigate('/PersonalPage')}>
                        <img src={user.file_name ? `/uploads/${user.file_name}` : '/default-avatar.png'} alt="avatar" className="img-avatar-header" />
                    </figure>
                    <div className="d-flex flex-column">
                        <h3>{user.pseudo}</h3>
                        <span>{user.name} {user.last_name}</span>
                    </div>
                </section>
                <section className="d-md-none">
                    <figure className="m-0" onClick={() => navigate('/PersonalPage')}>
                        <img src={user.file_name ? `/uploads/${user.file_name}` : '/default-avatar.png'} alt="avatar" className="img-avatar-header" />
                    </figure>
                </section>
                
                <div className="dropdown ">
                    <button className="btn btn-secondary btn-sm dropdown-toggle header-btn" type="button" data-bs-toggle="dropdown">
                        {t('common.languages')}
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
                <section className="header-right">
                    <div className="d-none d-md-flex d-flex gap-4">
                        <figure className="m-0 pp-icons-header">
                            <img src={messageIcon} alt="message-icon" />
                            <span>{t('common.messages')}</span>
                        </figure>
                        <figure className="m-0 pp-icons-header" onClick={() => navigate('/parameters')}>
                            <img src={parametersIcon} alt="parameters-icon" />
                            <span>{t('common.parameters')}</span>
                        </figure>
                        <figure className="m-0 pp-icons-header">
                            <img src={myPageIcon} alt="parameters-icon" onClick={() => navigate('/personalpage')} />
                            <span>{t('common.my-page')}</span>
                        </figure>
                        <figure className="m-0 pp-icons-header" data-tooltip={t('common.logout')} onClick={handleLogout}>
                            <img src={logoutIcon} alt="logout-icon" />
                            <span>{t('common.logout')}</span>
                        </figure>
                    </div>
                    <div className="dropdown d-md-none">
                    <button className="btn btn-secondary btn-sm dropdown-toggle header-btn-right" type="button" data-bs-toggle="dropdown">
                        {t('profile-page.go-to')}
                    </button>
                    <ul className="dropdown-menu">
                        <li>
                            <input type="button" value={t('common.messages')} className="btn btn-secondary header-btn btn-sm" />
                        </li>
                        <li>
                            <input type="button" value={t('common.parameters')} className="btn btn-secondary header-btn btn-sm" onClick={() => navigate('/Parameters') } />
                        </li>
                        <li>
                            <input type="button" value={t('common.my-page')} className="btn btn-secondary header-btn btn-sm" onClick={() => navigate('/personalpage') } /></li>
                        <li>
                            <input type="button" value={t('common.logout')} className="btn btn-secondary header-btn btn-sm" onClick={handleLogout} />
                        </li>
                    </ul>
                </div>
                </section>
            </header>
        </>
    )
}
export default HeaderOnline;