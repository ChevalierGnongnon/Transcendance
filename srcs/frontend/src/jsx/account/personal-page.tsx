import "../../scss/common-classes.scss";
import "../../scss/profile-page.scss";
import i18n from '../../../localisation/i18n';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import messageIcon from "../../assets/icons/icon-messages.png"
import updateShortcut from "../../assets/icons/icon-update.png"
import playShortcut from "../../assets/icons/play-shortcut.png"
import addFriendsIcon from "../../assets/icons/icon-add-friends.png"
import iconFriendList from "../../assets/icons/icon-friend-list.png"


interface User {
    name: string;
    last_name: string;
    email: string;
    pseudo: string;
    file_name: string | null;
    games_won: number;
    games_lost: number;
    best_score:number;
    games_played:number
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
                    <div className="d-flex flex-column">
                        <h1>{user.pseudo}</h1>
                        <span>{user.name} {user.last_name}</span>
                    </div>

                    <span>{t('profile-page.go-to')}</span>
                    <div className="d-flex gap-2 justify-content-center flex-wrap shortcut-grid">
                        <figure className="shortcut-icon justify-content-center">
                            <img src={messageIcon} alt="message-shortcut" />
                            <span>{t('common.messages')}</span>
                        </figure>
                        <figure className="shortcut-icon justify-content-center">
                            <img src={updateShortcut} alt="message-shortcut" />
                            <span>{t('common.update-my-profile')}</span>
                        </figure>
                        <figure className="shortcut-icon justify-content-center">
                            <img src={playShortcut} alt="play-shortcut" />
                            <span>{t('common.play')}</span>
                        </figure>
                    </div>

                    <span>{t('profile-page.my-friends')}</span>
                    <div className="d-flex gap-2 justify-content-center flex-wrap shortcut-grid">
                        <figure className="shortcut-icon justify-content-center">
                            <img src={iconFriendList} alt="message-shortcut" />
                            <span>{t('profile-page.friend-list')}</span>
                        </figure>
                        <figure className="shortcut-icon justify-content-center">
                            <img src={addFriendsIcon} alt="message-shortcut" />
                            <span>{t('profile-page.add-friend')}</span>
                        </figure>
                    </div>

                    <span>{t('profile-page.game-stats')}</span>
                    {/* <div className="d-flex gap-2 justify-content-center flex-wrap shortcut-grid">
                        <figure className="shortcut-icon justify-content-center">
                            <h1>{user.games_played}</h1>
                            <span>{t('profile-page.games-played')}</span>
                        </figure>
                        <figure className="shortcut-icon justify-content-center">
                            <h1>{user.games_won}</h1>
                            <span>{t('profile-page.games-won')}</span>
                        </figure>
                        <figure className="shortcut-icon justify-content-center">
                             <h1>{user.games_lost}</h1>
                            <span>{t('profile-page.games-lost')}</span>
                        </figure>
                        <figure className="shortcut-icon justify-content-center">
                             <h1>{user.best_score}</h1>
                            <span>{t('profile-page.best-score')}</span>
                        </figure>
                    </div> */}
                </div>
            </main>
        </>
    );
}
export default PersonalPage;