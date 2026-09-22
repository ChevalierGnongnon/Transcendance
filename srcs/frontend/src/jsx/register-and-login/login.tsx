import "../../scss/login.scss" //scss file, for styling
import "../../scss/common-classes.scss"
import ErrorMessage from "../others/error-message";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState, FormEvent } from "react";
import { useAuth } from "../auth/auth-context";

function Login() {
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const { login: authLogin } = useAuth();
	const manageSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const response = await fetch('/api/login', {
			method: 'POST',
			headers: { 'Content-type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ login, password })
		});
		const data = await response.json();
		if (response.ok) {
			authLogin();
			navigate('/personalpage');
		}
		else if (!response.ok)
			setError(data.error);
	}

	const { t } = useTranslation();

	return (

		<div className="d-flex justify-content-center align-items-center min-vh-100 mt-4">
			<form className="login-form d-flex flex-column align-items-center gap-3" onSubmit={manageSubmit}>
				<h1 className="login-title">{t('common.login')}</h1>
				<div className="d-flex flex-column flex-xl-row gap-2 w-100">
					<div className="connect-options-div">
						<label htmlFor="login" className="login-text">{t('login.mail-or-pseudo')}</label>
						<input type="text" name="name" value={login} placeholder={t('login.mail-or-pseudo')} className="form-control form-input" id="login" onChange={(e) => setLogin(e.target.value)} />
						<label htmlFor="password" className="login-text">{t('common.password')}</label>
						<input type="password" name="password" value={password} placeholder={t('common.password')} className="form-control form-input" id="password" onChange={(e) => setPassword(e.target.value)} />
						<button type="submit" className="btn btn-primary login-button">{t('common.login')}</button>
					</div>
				</div>
				<p className="login-text">{t('login.no-account')}</p>
				<ErrorMessage error={error} />
				<button type="button" onClick={() => navigate('/register')} className="btn btn-primary login-button">
					{t('login.create-account')}
				</button>
			</form>
		</div>
	);
}
export default Login;