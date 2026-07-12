import "../scss/login.scss" //scss file, for styling
import "../scss/common-classes.scss"
import "../scss/complete-profile.scss"
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { useState, FormEvent } from "react"
import ErrorMessage from "./error-message";


function CompleteYourProfile() {
	const { t } = useTranslation();
	const [pseudo, setPseudo] = useState("");
	const [avatar, setAvatar] = useState<File | string | null>(null);
	const defaultAvatars = [
		'/uploads/holocene.png',
		'/uploads/hershel.webp',
		'/uploads/kindred.png',
		'/uploads/radian.png',
		'/uploads/taxman.png',
		'/uploads/virtue.png'
	];
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const manageSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const response = await fetch('/api/complete-profile', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ pseudo, avatar })
		});
		const data = await response.json();
		if (response.ok){
			navigate('/personalpage');
		}
		else if (!response.ok)
			setError(data.error);
	}
	return (

		<div className="d-flex justify-content-center align-items-center min-vh-100">
			<form className="login-form d-flex flex-column align-items-center gap-3" onSubmit={manageSubmit}>
				<h1 className="login-title">{t('complete-your-profile.title')}</h1>
				<label htmlFor="pseudo" className="form-text">{t('complete-your-profile.enter-a-pseudo')}</label>
				<input type="text" name="name" value={pseudo} placeholder={t('complete-your-profile.enter-a-pseudo')} className="form-control form-input" id="pseudo" onChange={(e) => setPseudo(e.target.value)} />
				<label htmlFor="upload" className="form-text">{t('complete-your-profile.upload-avatar')}</label>
				<label htmlFor="avatar" className="btn btn-secondary btn-sm">
					{t('complete-your-profile.upload-avatar')}
				</label>
				<input type="file" id="avatar" accept="image/*" style={{ display: 'none' }} onChange={(e) => setAvatar(e.target.files?.[0] ?? null)} />
				<p className="form-text">
					{t('complete-your-profile.choose-an-avatar')}
				</p>
				<div className="d-flex gap-2 justify-content-center flex-wrap avatar-grid">
					{defaultAvatars.map((item, i) => (
						<img key={i} src={item} alt={`avatar-${i}`} className={`img-avatar ${avatar === item ? 'selected' : ''}`} onClick={() => setAvatar(item)} />
					))}
				</div>
				<ErrorMessage error={error} />
				<button type="submit" className="btn btn-primary btn-sm align-self-center">
					{t('complete-your-profile.confirm')}
				</button>
			</form>
		</div>
	);
}
export default CompleteYourProfile;