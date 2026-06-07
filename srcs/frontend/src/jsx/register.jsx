import "../scss/register.scss"
import { useState } from "react"
import { useTranslation } from 'react-i18next';
import ErrorMessage from "./error-message.jsx";

function Register({ onSuccess }) {
	const [name, setName] = useState("");
	const [last_name, setLastName] = useState("");
	const [pseudo, setPseudo] = useState("");
	const [email, setEmail] = useState("");
	const [birthdate, setBirthDate] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVerify, setPasswordVerify] = useState("");
	const [error, setError] = useState(null);

	const { t } = useTranslation();

	const manageSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		try {
			const response = await fetch('/api/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, last_name, email, password, passwordVerify, birthdate })
			});
			const data = await response.json();
			if (response.ok)
				onSuccess(data.token);
			else
				setError(data.error);
		} catch (err) {
			setError('DATABASE_ERROR');
		}
	}

	return (
		<div className="d-flex justify-content-center align-items-center min-vh-100">
			<form className="login-form d-flex flex-column align-items-center gap-3" onSubmit={manageSubmit}>
				<h1 className="register-title">{t('register.title')}</h1>
				<div className="d-flex gap-3 w-100">
					<div className="connect-options-div">
						<label htmlFor="name" className="login-text">{t('register.label_name')}</label>
						<input type="text" name="name" value={name} placeholder={t('register.placeholder_name')} className="form-control login-input" id="name" onChange={(e) => setName(e.target.value)} />
						<label htmlFor="last_name" className="login-text">{t('register.label_lastname')}</label>
						<input type="text" name="last_name" value={last_name} placeholder={t('register.placeholder_lastname')} className="form-control login-input" id="last_name" onChange={(e) => setLastName(e.target.value)} />
						<label htmlFor="email" className="login-text">{t('register.label_email')}</label>
						<input type="email" name="email" value={email} placeholder="example@example.com" className="form-control login-input" id="email" onChange={(e) => setEmail(e.target.value)} />
						<label htmlFor="password" className="login-text">{t('common.label_password')}</label>
						<input type="password" name="password" value={password} placeholder={t('common.placeholder_password')} className="form-control login-input" id="password" onChange={(e) => setPassword(e.target.value)} />
						<label htmlFor="password_verify" className="login-text">{t('common.label_password_verify')}</label>
						<input type="password" name="password_verify" value={passwordVerify} placeholder={t('common.placeholder_password_verify')} className="form-control login-input" id="password_verify" onChange={(e) => setPasswordVerify(e.target.value)} />
						<label htmlFor="birthdate" className="login-text">{t('register.label_birthdate')}</label>
						<input type="date" name="birthdate" value={birthdate} className="form-control login-input" id="birthdate" onChange={(e) => setBirthDate(e.target.value)} />
						<ErrorMessage error={error} />
						<button type="submit" className="btn btn-primary form-button">{t('register.button')}</button>
					</div>
					<div className="separator-or">{t('login.or')}</div>
					<div className="connect-options-div">
						<a href="https://localhost:8443/api/auth/google" className="btn btn-outline-dark d-flex align-items-center gap-2 google-button">
							<svg width="18" height="18" viewBox="0 0 48 48">
								<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
								<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
								<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
								<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
							</svg>
							{t('register.register-google')}
						</a>
						<a href="https://localhost:8443/api/auth/github" className="btn github-button d-flex align-items-center gap-2">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="white">
								<path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
							</svg>
							{t('register.register-github')}
						</a>
						<a href="https://localhost:8443/api/auth/42" className="btn d-flex align-items-center fourty-two-button gap-2">
							<span style={{ fontWeight: 'bold', fontSize: '18px' }}>42</span>
							{t('register.register-fourty-two')}
						</a>
					</div>
				</div>
			</form>
		</div>
	);
}
export default Register;