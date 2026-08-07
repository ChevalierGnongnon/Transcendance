import "../../scss/common-classes.scss";
import "../../scss/profile-page.scss";
import i18n from '../../../localisation/i18n';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import messageShortcut from "../../assets/icons/message-shortcut.png"
import updateShortcut from "../../assets/icons/update-shortcut.png"


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
        return <p>Chargement...</p>;
    return (
        <>
            <main className="d-flex flex-column justify-content-center align-items-center">
                <img src={user.file_name ? `/uploads/${user.file_name}` : '/default-avatar.png'} alt="avatar" className="img-avatar-profile-page" />
                <div className="d-flex gap-2 justify-content-center flex-wrap shortcut-grid">
                    <figure className="shortcut-icon">
                        <img src={messageShortcut} alt="message-shortcut" />
                        <span>Messages</span>
                    </figure>
                    <figure className="shortcut-icon">
                        <img src={updateShortcut} alt="message-shortcut" />
                        <span>Update my profile</span>
                    </figure>
                </div>
                <span>Game stats</span>
                <div className="d-flex gap-2 justify-content-center flex-wrap shortcut-grid">
                    <figure className="shortcut-icon">
                        <span>Games won</span>
                    </figure>
                    <figure className="shortcut-icon">
                        <span>Games lost</span>
                    </figure>
                    <figure className="shortcut-icon">
                        <span>Best score</span>
                    </figure>
                </div>
            </main>
        </>
    );
}
export default PersonalPage;