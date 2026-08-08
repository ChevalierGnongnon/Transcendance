import "../../scss/common-classes.scss";
import "../../scss/profile-page.scss";
import i18n from '../../../localisation/i18n';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import messageShortcut from "../../assets/icons/message-shortcut.png"
import updateShortcut from "../../assets/icons/update-shortcut.png"
import playShortcut from "../../assets/icons/play-shortcut.png"

interface User {
    name: string;
    last_name: string;
    email: string;
    pseudo: string;
    file_name: string | null;
}

function PersonalPage() {
    const [user, setUser] = useState<User | null>(null);
    const { t } = useTranslation();
    useEffect(() => {
        fetch('/api/my-profile', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => setUser(data))
    }, []);

    if (!user)
        return <p>{t('common.loading')}</p>;
    return (
        <>
            <main className="d-flex flex-column justify-content-center align-items-center">
                <div className="profile-page d-flex flex-column gap-3 justify-content-center align-items-center min-vh-100">
                    <img src={user.file_name ? `/uploads/${user.file_name}` : '/default-avatar.png'} alt="avatar" className="img-avatar-profile-page" />
                    <span>{t('profile-page.go-to')}</span>
                    <div className="d-flex gap-2 justify-content-center flex-wrap shortcut-grid">
                        <figure className="shortcut-icon">
                            <img src={messageShortcut} alt="message-shortcut" />
                            <span>{t('common.messages')}</span>
                        </figure>
                        <figure className="shortcut-icon">
                            <img src={updateShortcut} alt="message-shortcut" />
                            <span>{t('common.update-my-profile')}</span>
                        </figure>
                        <figure className="shortcut-icon">
                            <img src={playShortcut} alt="play-shortcut" />
                            <span>{t('common.play')}</span>
                        </figure>
                    </div>
                    <span>{t('profile-page.game-stats')}</span>
                    <div className="d-flex gap-2 justify-content-center flex-wrap shortcut-grid">
                        <figure className="shortcut-icon">
                            <span>{t('profile-page.games-won')}</span>
                        </figure>
                        <figure className="shortcut-icon">
                            <span>{t('profile-page.games-lost')}</span>
                        </figure>
                        <figure className="shortcut-icon">
                            <span>{t('profile-page.best-score')}</span>
                        </figure>
                    </div>
                </div>
            </main>
        </>
    );
}
export default PersonalPage;