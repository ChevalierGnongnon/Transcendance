import "../../scss/common-classes.scss";
import "../../scss/profile-page.scss";
import i18n from '../../../localisation/i18n';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";


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
            <main className="d-flex justify-content-center align-items-center min-vh-100">
                
            </main>
        </>
    );
}
export default PersonalPage;