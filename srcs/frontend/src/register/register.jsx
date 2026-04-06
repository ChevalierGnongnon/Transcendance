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
				<span className="register-text">Name : </span>
				<input type="text" name="name" value={name} placeholder="Name" className="form-control register-input"   onChange={(e) => setName(e.target.value)}/>
				<span className="register-text">Last name : </span>
				<input type="text" name="last_name" value={last_name} placeholder="Last name" className="form-control register-input"   onChange={(e) => setLastName(e.target.value)}/>
				<span className="register-text">Pseudo :</span>
				<input type="text" name="pseudo" value={pseudo} placeholder="Pseudo" className="form-control register-input"   onChange={(e) => setPseudo(e.target.value)}/>
				<span className="register-text">Email :</span>
				<input type="email" name="email" value={email} placeholder="example@example.com" className="form-control register-input" onChange={(e) => setEmail(e.target.value)}/>
				<span className="register-text">Password :</span>
				<input type="password" name="password" value={password} placeholder="Password" className="form-control register-input" onChange={(e) => setPassword(e.target.value)}/>
				<span className="register-text">Re-enter password :</span>
				<input type="password" name="password_verify" value={passwordVerify} placeholder="password verify" className="form-control register-input" onChange={(e) => setPasswordVerify(e.target.value)}/>
				<span className="register-text">Birthdate :</span>
				<input type="date" name="birthdate" value={birthdate} className="form-control register-input" onChange={(e) => setBirthDate(e.target.value)}/>
				<button type="submit" className="btn btn-primary register-button">Register</button>
			</form>
		</div>
	);
}
export default Register;