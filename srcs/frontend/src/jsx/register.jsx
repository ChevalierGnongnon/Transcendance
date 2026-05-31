import "../scss/register.scss"
import { useState } from "react"
import { useTranslation } from 'react-i18next';

function Register(){
	const [name, setName] = useState("");
	const [last_name, setLastName] = useState("");
	const [pseudo, setPseudo] = useState("");
	const [email, setEmail] = useState("");
	const [birthdate, setBirthDate] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVerify, setPasswordVerify] = useState("");

	const { t } = useTranslation();

	const manageSubmit = (e) =>{
		e.preventDefault();
		console.log({ name, last_name, pseudo, email, password, passwordVerify, birthdate });
	}

	return (
		<div className="d-flex justify-content-center align-items-center min-vh-100">
    		<form className="login-form d-flex flex-column align-items-center gap-3">
				<h1 className="register-title">{t('register.title')}</h1>
				<label htmlFor="name" className="form-text">{t('register.label_name')}</label>
				<input type="text" name="name" value={name} placeholder={t('register.placeholder_name')} className="form-control form-input" id="name" onChange={(e) => setName(e.target.value)}/>
				<label htmlFor="last_name" className="form-text">{t('register.label_lastname')}</label>
				<input type="text" name="last_name" value={last_name} placeholder={t('register.placeholder_lastname')} className="form-control form-input" id="last_name" onChange={(e) => setLastName(e.target.value)}/>
				<label htmlFor="pseudo" className="form-text">{t('register.label_pseudo')}</label>
				<input type="text" name="pseudo" value={pseudo} placeholder={t('register.placeholder_pseudo')} className="form-control form-input" id="pseudo" onChange={(e) => setPseudo(e.target.value)}/>
				<label htmlFor="email" className="form-text">{t('register.label_email')}</label>
				<input type="email" name="email" value={email} placeholder="example@example.com" className="form-control form-input" id="email" onChange={(e) => setEmail(e.target.value)}/>
				<label htmlFor="password" className="form-text">{t('common.label_password')}</label>
				<input type="password" name="password" value={password} placeholder={t('common.placeholder_password')} className="form-control form-input" id="password" onChange={(e) => setPassword(e.target.value)}/>
				<label htmlFor="password_verify" className="form-text">{t('common.label_password_verify')}</label>
				<input type="password" name="password_verify" value={passwordVerify} placeholder={t('common.placeholder_password_verify')} className="form-control form-input" id="password_verify" onChange={(e) => setPasswordVerify(e.target.value)}/>
				<label htmlFor="birthdate" className="form-text">{t('register.label_birthdate')}</label>
				<input type="date" name="birthdate" value={birthdate} className="form-control form-input" id="birthdate" onChange={(e) => setBirthDate(e.target.value)}/>
				<button type="submit" className="btn btn-primary form-button">{t('register.button')}</button>
			</form>
		</div>
	);
}
export default Register;