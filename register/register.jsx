import "./register.scss" //scss file, for styling
import {useState} from "react" //allows re-render
function Register(){
	const [email, setEmail] = useState("");
	return (
		<form action="" className="register-form">
			<input type="email" name="" value={email} placeholder="example@example.com" id="" className="register-mail-input" onChange={(e) => setEmail(e.target.value)}/>
			<input type="text" name="" id="" className="register-text-input" />
			<input type="text" name="" id="" className="register-text-input" />
			<input type="text" name="" id="" className="register-text-input" />
			<input type="text" name="" id="" className="register-text-input" />
		</form>
	)
}