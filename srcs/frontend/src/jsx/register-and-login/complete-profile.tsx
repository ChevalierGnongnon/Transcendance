import "../../scss/login.scss" //scss file, for styling
import "../../scss/common-classes.scss"
import "../../scss/complete-profile.scss"
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { useState, useEffect, FormEvent } from "react"
import ErrorMessage from "../others/error-message";
import { useApiFetch } from "../auth/use-api-fetch";
import { useAuth } from "../auth/auth-context";

interface DefaultAvatar {
	file_id: string;
	file_name: string;
}

function CompleteYourProfile() {
	const { t } = useTranslation();
	const [pseudo, setPseudo] = useState("");
	const [avatar, setAvatar] = useState<File | string | null>(null);
	const [defaultAvatars, setDefaultAvatars] = useState<DefaultAvatar[]>([]);
	const [error, setError] = useState<string | null>(null);
	const apiFetch = useApiFetch();
	const {login} = useAuth();

	useEffect(() => {
		fetch('/api/default-avatars')
			.then(res => res.json())
			.then((data: DefaultAvatar[]) => setDefaultAvatars(data))
			.catch(() => setError('FETCH_DEFAULT_AVATARS_ERROR'));
	}, []);
	const navigate = useNavigate();

	const manageSubmit = async (e: FormEvent<HTMLFormElement>) => {
		let avatarId: string | null = avatar instanceof File ? null : avatar;

		e.preventDefault();
		if (avatar === null){
			setError('AVATAR_REQUIRED');
			return ;
		}
		const response = await fetch('/api/complete-profile', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ pseudo, avatar: avatarId, avatarPending: avatar instanceof File })
		});
		const data = await response.json();
		if (response.ok){
			if (avatar instanceof File) {
				const formData = new FormData();
				formData.append('file', avatar);
				const uploadResponse = await apiFetch('/api/avatar', {
					method: 'POST',
					credentials: 'include',
					body: formData
				});
				const uploadData = await uploadResponse.json();
				if (!uploadResponse.ok) {
					setError(uploadData.error);
					return;
				}
				avatarId = uploadData.file_id;
			}
		}
		else {
			setError(data.error);
			return ;
		}
		login();
			navigate('/personalpage');
	}
	return (
		<div className="d-flex justify-content-center align-items-center min-vh-100">
			<form className="login-form d-flex flex-column align-items-center gap-3" encType="multipart/form-data" onSubmit={manageSubmit}>
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
					{defaultAvatars.map((item) => (
						<img key={item.file_id} src={`/uploads/${item.file_name}`} alt={item.file_name} className={`img-avatar ${avatar === item.id ? 'selected' : ''}`} onClick={() => setAvatar(item.id)} />
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
