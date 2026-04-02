import "./register.scss" //scss file, for styling
import {useState} from "react" //allows re-render
function Register(){
	const [name, setName] = useState("");
	const [last_name, setLastName] = useState("");
	const [pseudo, setPseudo] = useState("");	
	const [email, setEmail] = useState("");
	const [birthdate, setBirthDate] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVerify, setPasswordVerify] = useState("");
	
	return (
		<form className="register-form">
			<input type="text" name="name" value={name} placeholder="Name" className="register-text-input"   onChange={(e) => setName(e.target.value)}/>
			<input type="text" name="last_name" value={last_name} placeholder="Last name" className="register-text-input"   onChange={(e) => setLastName(e.target.value)}/>
			<input type="text" name="pseudo" value={pseudo} placeholder="Pseudo" className="register-text-input"   onChange={(e) => setPseudo(e.target.value)}/>
			<input type="email" name="email" value={email} placeholder="example@example.com" className="register-email-input" onChange={(e) => setEmail(e.target.value)}/>
			<input type="password" name="password" value={password} placeholder="Password" className="register-password-input" onChange={(e) => setPassword(e.target.value)}/>
			<input type="password" name="password-verify" value={passwordVerify} placeholder="Password" className="register-password-input" onChange={(e) => setPasswordVerify(e.target.value)}/>
			<input type="date" name="birthdate" value={birthdate} className="register-birthdate-input" onChange={(e) => setBirthDate(e.target.value)}/>
			<button type="submit" className="register-submit-button">Submit</button>
		</form>
	);
}