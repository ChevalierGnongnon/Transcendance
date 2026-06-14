import { useState } from "react";
import Register from "./register.jsx";
import CompleteYourProfile  from "./complete-profile.jsx";


function RegisterFlow() {
    const [step, setStep] = useState(1);
    return (
        <>
            {step === 1 && <Register onSuccess={ () => setStep(2) } />}
            {step === 2 && <CompleteYourProfile />}
        </>
    )
}
export default RegisterFlow;