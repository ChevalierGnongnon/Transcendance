import "../../scss/login.scss" //scss file, for styling
import "../../scss/common-classes.scss"
import "../../scss/register.scss"
import { useState, FormEvent, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from "../others/error-message";
import { useAuth } from "../auth/auth-context";
import FileImport from "../files/file-import";

interface DefaultAvatar {
    id: string;
    name: string;
}

function Register() {
	const [name, setName] = useState("");
	const [last_name, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [birthdate, setBirthDate] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVerify, setPasswordVerify] = useState("");
	const [error, setError] = useState<string | null> (null);
	const { t } = useTranslation();
	const [pseudo, setPseudo] = useState("");
	const [avatar, setAvatar] = useState<string | null>(null);
	const [defaultAvatars, setDefaultAvatars] = useState<DefaultAvatar[]>([]);
	// const [error, setError] = useState<string | null>(null);
	const [hasCustomFile, setHasCustomFile] = useState<boolean>(false);
	const [pickedDefault, setPickedDefault] = useState<boolean>(false);
	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const {login} = useAuth();
	const navigate = useNavigate();
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const manageSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		try {
			const formData = new FormData();
			formData.append('name', name);
			formData.append('last_name', last_name);
			formData.append('email', email);
			formData.append('password', password);
			formData.append('passwordVerify', passwordVerify);
			formData.append('birthdate', birthdate);
			formData.append('pseudo', pseudo);
			
			if (avatarFile){
				formData.append('avatar', avatarFile);
			}
			else {
				if (avatar)
					formData.append('avatar', avatar);
			}
			const response = new XMLHttpRequest();
			response.open('POST', '/api/register');
			response.onload = () =>{
				if (response.status === 201){
					login();
					navigate('/personalpage')
				}
				else {
					const error = JSON.parse(response.responseText);
					setError(error.error);
				}
			}
			response.upload.onprogress = (event)=>{
				const progress = (event.loaded / event.total) * 100;
				setUploadProgress(progress);
			}
			response.onerror = () => {
				setError('DATABASE_ERROR');
			};
			response.send(formData);
		} catch (err) {
			setError('DATABASE_ERROR');
		}
	}
	useEffect(() => {
			fetch('/api/default-avatars')
				.then(res => res.json())
				.then((data: DefaultAvatar[]) => setDefaultAvatars(data))
				.catch(() => setError('FETCH_DEFAULT_AVATARS_ERROR'));
	}, []);

	return (
		<div className="d-flex justify-content-center align-items-center min-vh-100 mt-4">
			<form className="login-form d-flex flex-column align-items-center gap-3" onSubmit={manageSubmit}>
				<h1 className="register-title">{t('common.register')}</h1>
					<div className="d-flex flex-column flex-xl-row gap-2 w-100">
						<div className="connect-options-div">
						<label htmlFor="name" className="login-text">{t('common.name')}</label>
						<input type="text" name="name" value={name} placeholder={t('common.name')} className="form-control form-input" id="name" onChange={(e) => setName(e.target.value)} />
						<label htmlFor="last_name" className="login-text">{t('common.lastname')}</label>
						<input type="text" name="last_name" value={last_name} placeholder={t('common.lastname')} className="form-control form-input" id="last_name" onChange={(e) => setLastName(e.target.value)} />
						<label htmlFor="email" className="login-text">{t('common.email')}</label>
						<input type="email" name="email" value={email} placeholder="example@example.com" className="form-control form-input" id="email" onChange={(e) => setEmail(e.target.value)} />
						<label htmlFor="password" className="login-text">{t('common.password')}</label>
						<input type="password" name="password" value={password} placeholder={t('common.password')} className="form-control form-input" id="password" onChange={(e) => setPassword(e.target.value)} />
						<label htmlFor="password_verify" className="login-text">{t('common.password_verify')}</label>
						<input type="password" name="password_verify" value={passwordVerify} placeholder={t('common.password_verify')} className="form-control form-input" id="password_verify" onChange={(e) => setPasswordVerify(e.target.value)} />
						<label htmlFor="birthdate" className="login-text">{t('register.birthdate')}</label>
						<input type="date" name="birthdate" value={birthdate} className="form-control form-input" id="birthdate" onChange={(e) => setBirthDate(e.target.value)} />
						
						<h1 className="login-title">{t('complete-your-profile.title')} :</h1>
						<label htmlFor="pseudo" className="login-text">{t('complete-your-profile.enter-a-pseudo')}</label>
						<input type="text" name="name" value={pseudo} placeholder={t('complete-your-profile.enter-a-pseudo')} className="form-control form-input" id="pseudo" onChange={(e) => setPseudo(e.target.value)} />
						{!pickedDefault && (
							<FileImport
								mode="avatar"
								onUploaded={(fileId) => setAvatar(fileId)}
								onSelectedChange={setHasCustomFile}
								deferUpload={true}
								externalProgress={uploadProgress}
								onFileReady={(file) => { setAvatarFile(file); if (file === null) setUploadProgress(0); }}
							/>
						)}
						
						
						
						{!hasCustomFile && (
							<>
								<label className="login-text">
									{t('complete-your-profile.choose-an-avatar')}
								</label>
								<div className="d-flex gap-2 justify-content-center flex-wrap avatar-grid">
									{defaultAvatars.map((item) => (
										<img
											key={item.id}
											src={`/api/${item.id}/download`}
											alt={item.name}
											className={`img-avatar-completeProfile ${avatar === item.id ? 'selected' : ''}`}
											onClick={() => { setAvatar(item.id); setPickedDefault(true); }}
										/>
									))}
								</div>
							
							</>
						)}

						{pickedDefault && (
							<input
								type="button"
								value={t('common.import-file-instead')}
								onClick={()=>{ setPickedDefault(false); setAvatar(null); }}
								className="undo_button"
							/>
						)}
						<ErrorMessage error={error} />
						<button type="submit" className="btn btn-primary register-button">{t('common.register')}</button>
					</div>
				</div>
				<p className="login-text">{t('register.already-have-account')}</p>
				<button type="button" onClick={() => navigate('/login')} className="btn btn-primary register-button">
					{t('common.login')}
				</button>
			</form>
		</div>
	);
}
export default Register;