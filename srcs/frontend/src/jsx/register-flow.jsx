import { useState } from "react";
import Register from "./register.jsx";
import CompleteYourProfile  from "./complete-profile.jsx";


function RegisterFlow() {
    const [step, setStep] = useState(1);
    const [token, setToken] = useState(null);
    return (
        <>
            {step === 1 && <Register onSuccess={(token) => { setToken(token); setStep(2) }} />}
            {step === 2 && <CompleteYourProfile token={token} />}
        </>
    )
}
export default RegisterFlow;