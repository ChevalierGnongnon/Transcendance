import "../scss/login.scss" //scss file, for styling
import "../scss/common-classes.scss"
import { useState } from "react" //allows re-render
import { useTranslation } from 'react-i18next';

function CompleteYourProfile(){
    const {t} = useTranslation();
	const [pseudo, setPseudo] = useState("");

	const manageSubmit = (e) => {
		e.preventDefault();
		console.log({ pseudo });
	}
    return (
		
        <div className="d-flex justify-content-center align-items-center min-vh-100">
			<form className="login-form d-flex flex-column gap-3" onSubmit={manageSubmit} >
				<h1 className="login-title">{t('complete-your-profile.title')}</h1>
				<label htmlFor="pseudo" className="form-text">{t('complete-your-profile.label-pseudo')}</label>
				<input type="text" name="name" value={pseudo} placeholder={t('login.placeholder_login')} className="form-control form-input" id="pseudo" onChange={(e) => setPseudo(e.target.value)} />
				<label htmlFor="label-upload" className="form-text">{t('complete-your-profile.upload-avatar')}</label>
				<input type="file" name="Upload a profile photo" id="upload-profile-photo" className="upload" />
				<button type="submit" className="btn btn-primary form-button">{t('complete-your-profile.complete-button')}</button>
			</form>
		</div>
    );
}
export default CompleteYourProfile;