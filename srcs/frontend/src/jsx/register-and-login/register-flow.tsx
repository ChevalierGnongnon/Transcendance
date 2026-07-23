import "../../scss/login.scss" //scss file, for styling
import "../../scss/common-classes.scss"
import { useState } from "react";
import Register from "./register";
import CompleteYourProfile  from "./complete-profile";


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