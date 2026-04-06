import "../scss/login.scss" //scss file, for styling
import "../scss/common-classes.scss"
import {useState} from "react" //allows re-render


function Login(){
	const [login, setName] = useState("");
	const [password, setLastName] = useState("");

	const manageSubmit = (e) =>{
		e.preventDefault();
		console.log({login, password});
	}
	
	return (
		<div className="d-flex justify-content-center align-items-center min-vh-100">
			<form className="login-form d-flex flex-column gap-3" onSubmit={manageSubmit} >
				<h1 className="login-title">Register</h1>
				<label htmlFor="login" className="form-text">Login or email:</label>
				<input type="text" name="name" value={login} placeholder="login or email" className="form-control form-input" id="login" onChange={(e) => setName(e.target.value)}/>
				<label htmlFor="password" className="form-text">Password:</label>
				<input type="password" name="last_name" value={password} placeholder="Last name" className="form-control form-input" id="password" onChange={(e) => setLastName(e.target.value)}/>
				<button type="submit" className="btn btn-primary form-button">Login</button>
			</form>
		</div>
	);
}
export default Login;