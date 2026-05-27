import "../scss/login.scss" //scss file, for styling
import "../scss/common-classes.scss"
import { useState } from "react" //allows re-render
import { useTranslation } from 'react-i18next';

function CompleteYourProfile(){
    const {t} = useTranslation();
	const [pseudo, setPseudo] = useState("");
	const [avatar, setAvatar] = useState(null);

	const manageSubmit = (e) => {
		e.preventDefault();
		console.log({ pseudo, avatar });
	}
    return (
		
        <div className="d-flex justify-content-center align-items-center min-vh-100">
			<form className="login-form d-flex flex-column gap-3" onSubmit={manageSubmit} >
				<h1 className="login-title">{t('complete-your-profile.title')}</h1>
				<label htmlFor="pseudo" className="form-text">{t('complete-your-profile.label-pseudo')}</label>
				<input type="text" name="name" value={pseudo} placeholder={t('login.placeholder_login')} className="form-control form-input" id="pseudo" onChange={(e) => setPseudo(e.target.value)} />
				<label htmlFor="upload" className="form-text">{t('complete-your-profile.upload-avatar')}</label>
				<label htmlFor="avatar" className="btn btn-secondary btn-sm align-self-start">
    				{t('complete-your-profile.upload-avatar')}
				</label>
				<input type="file" id="avatar" accept="image/*" style={{display: 'none'}} onChange={(e) => setAvatar(e.target.files[0])} />
				<label htmlFor="avatar" className="form-text">
    				{t('complete-your-profile.choose-an-avatar')}
				</label>
				<button type="submit" className="btn btn-primary btn-sm align-self-center">
    				{t('complete-your-profile.complete-button')}
				</button>
			</form>
		</div>
    );
}
export default CompleteYourProfile;