import "../scss/common-classes.scss";
import "../scss/profile-page.scss";
import i18n from '../../localisation/i18n.js';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import messageIcon from '../assets/icons/icon-messages.png';
import parametersIcon from '../assets/icons/icon-parameters.png';
import notificationIcon from '../assets/icons/icon-notifications.png'

function PersonalPage() {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    useEffect(() => {
        fetch('/api/my-profile', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        })
            .then(res => res.json())
            .then(data => setUser(data))
    }, []);

    if (!user)
        return <p>Chargement...</p>;
    return (
        <>
            <header className="profile-page-header">
                <section className="d-flex align-items-center gap-3">
                    <figure className="m-0">
                        <img src={user.profile_photo_url} alt="avatar" className="img-avatar-profilePage" />
                    </figure>
                    <div className="d-flex flex-column">
                        <h3>{user.pseudo}</h3>
                        <span>{user.name} {user.last_name}</span>
                    </div>
                </section>
                <section className="ms-auto d-flex gap-2">
                    <figure className="m-0 pp-icons-header" img data-tooltip="Messages">
                        <img src={messageIcon} alt="message-icon"/>
                    </figure>
                    <figure className="m-0 pp-icons-header" img data-tooltip="Parametres">
                         <img src={notificationIcon} alt="parameters-icon"/>
                    </figure>
                    <figure className="m-0 pp-icons-header" img data-tooltip="Parametres">
                        <img src={parametersIcon} alt="parameters-icon"/>
                    </figure>
                </section>
            </header>
            <main className="d-flex justify-content-center align-items-center min-vh-100">

            </main>
        </>
    );
}
export default PersonalPage;