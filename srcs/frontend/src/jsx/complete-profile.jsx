import "../scss/login.scss" //scss file, for styling
import "../scss/common-classes.scss"
import { useState } from "react" //allows re-render
import { useTranslation } from 'react-i18next';
import { errorMessage } from "./error-message.jsx";
import holocene from '../assets/avatars/holocene.png';
import kindred from '../assets/avatars/kindred.png';
import radian from '../assets/avatars/radian.png';
import taxman from '../assets/avatars/taxman.png';
import virtue from '../assets/avatars/virtue.png';
import hershel from '../assets/avatars/hershel.webp';


function CompleteYourProfile({ token }) {
	const { t } = useTranslation();
	const [pseudo, setPseudo] = useState("");
	const [avatar, setAvatar] = useState(null);
	const defaultAvatars = [
		{ src: holocene, name: 'holocene.png' },
		{ src: kindred, name: 'kindred.png' },
		{ src: radian, name: 'radian.png' },
		{ src: taxman, name: 'taxman.png' },
		{ src: virtue, name: 'virtue.png' },
		{ src: hershel, name: 'hershel.webp' },
	];
	const [error, setError] = useState(null);

	const manageSubmit = async (e) => {
		e.preventDefault();
		const response = await fetch('/api/complete-profile', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ pseudo, avatar, token })
		});
		const data = await response.json();
		if (!response.ok)
			console.error(data.error);
	}
	return (

		<div className="d-flex justify-content-center align-items-center min-vh-100">
			<form className="login-form d-flex flex-column align-items-center gap-3" onSubmit={manageSubmit}>
				<h1 className="login-title">{t('complete-your-profile.title')}</h1>
				<label htmlFor="pseudo" className="form-text">{t('complete-your-profile.label-pseudo')}</label>
				<input type="text" name="name" value={pseudo} placeholder={t('complete-your-profile.placeholder_pseudo')} className="form-control form-input" id="pseudo" onChange={(e) => setPseudo(e.target.value)} />
				<label htmlFor="upload" className="form-text">{t('complete-your-profile.upload-avatar')}</label>
				<label htmlFor="avatar" className="btn btn-secondary btn-sm">
					{t('complete-your-profile.upload-avatar')}
				</label>
				<input type="file" id="avatar" accept="image/*" style={{ display: 'none' }} onChange={(e) => setAvatar(e.target.files[0])} />
				<p className="form-text">
					{t('complete-your-profile.choose-an-avatar')}
				</p>
				<div className="d-flex gap-2 justify-content-center flex-wrap avatar-grid">
					{defaultAvatars.map((item, i) => (
						<img key={i} src={item.src} alt={`avatar-${i}`} className={`img-avatar ${avatar === item.name ? 'selected' : ''}`} onClick={() => setAvatar(item.name)} />
					))}
				</div>
				<ErrorMessage error={error} />
				<button type="submit" className="btn btn-primary btn-sm align-self-center">
					{t('complete-your-profile.complete-button')}
				</button>
			</form>
		</div>
	);
}
export default CompleteYourProfile;