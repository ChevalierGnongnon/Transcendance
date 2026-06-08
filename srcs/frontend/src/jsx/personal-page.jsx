import "../scss/common-classes.scss"
import i18n from '../../localisation/i18n.js'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";

function PersonalPage() {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
if (!user) return <p>Chargement...</p>
    useEffect(() => {
        fetch('/api/my-profile', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        })
        .then(res => res.json())
        .then(data => setUser(data))
    }, []);
    return (

        <main className="d-flex justify-content-center align-items-center min-vh-100">
            <section className="d-flex flex-column align-items-center gap-3">
                <figure>
                    <img src={user.profile_photo_url} alt="avatar" className="profile-photo" />
                </figure>
            </section>
        </main>
    );
}
export default PersonalPage;