import "../scss/login.scss" //scss file, for styling
import "../scss/common-classes.scss"
import { useState } from "react" //allows re-render
import { useTranslation } from 'react-i18next';


function Login() {
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");

	const manageSubmit = (e) => {
		e.preventDefault();
		console.log({ login, password });
	}

	const {t} = useTranslation();

	return (
		
		<div className="d-flex justify-content-center align-items-center min-vh-100">
			<form className="login-form d-flex flex-column gap-3" onSubmit={manageSubmit} >
				<h1 className="login-title">{t('login.title')}</h1>
				<label htmlFor="login" className="form-text">{t('login.label_login')}</label>
				<input type="text" name="name" value={login} placeholder={t('login.placeholder_login')} className="form-control form-input" id="login" onChange={(e) => setLogin(e.target.value)} />
				<label htmlFor="password" className="form-text">{t('common.label_password')}</label>
				<input type="password" name="last_name" value={password} placeholder={t('common.placeholder_password')} className="form-control form-input" id="password" onChange={(e) => setPassword(e.target.value)} />
				<button type="submit" className="btn btn-primary form-button">{t('login.button')}</button>
			</form>
		</div>
	);
}
export default Login;