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

	const manageSubmit = (e) =>{
		e.preventDefault();
		console.log({ name, last_name, pseudo, email, password, passwordVerify, birthdate,});
	}
	
	return (
		<div className="d-flex justify-content-center align-items-center min-vh-100">
			<form className="register-form d-flex flex-column gap-3" onSubmit={manageSubmit} >
				<label htmlFor="name" className="register-text">Name:</label>
				<input type="text" name="name" value={name} placeholder="Name" className="form-control register-input" id="name" onChange={(e) => setName(e.target.value)}/>
				<label htmlFor="last_name" className="register-text">Last name:</label>
				<input type="text" name="last_name" value={last_name} placeholder="Last name" className="form-control register-input" id="last_name" onChange={(e) => setLastName(e.target.value)}/>
				<label htmlFor="pseudo" className="register-text">Pseudo:</label>
				<input type="text" name="pseudo" value={pseudo} placeholder="Pseudo" className="form-control register-input" id="pseudo" onChange={(e) => setPseudo(e.target.value)}/>
				<label htmlFor="email" className="register-text">Email:</label>
				<input type="email" name="email" value={email} placeholder="example@example.com" className="form-control register-input" id="email" onChange={(e) => setEmail(e.target.value)}/>
				<label htmlFor="password" className="register-text">Password:</label>
				<input type="password" name="password" value={password} placeholder="Password" className="form-control register-input" id="password" onChange={(e) => setPassword(e.target.value)}/>
				<label htmlFor="password_verify" className="register-text">Password verify: </label>
				<input type="password" name="password_verify" value={passwordVerify} placeholder="password verify" className="form-control register-input" id="password_verify" onChange={(e) => setPasswordVerify(e.target.value)}/>
				<label htmlFor="birthdate" className="register-text">Birthdate:</label>
				<input type="date" name="birthdate" value={birthdate} className="form-control register-input" id="birthdate" onChange={(e) => setBirthDate(e.target.value)}/>
				<button type="submit" className="btn btn-primary register-button">Register</button>
			</form>
		</div>
	);
}
export default Register;