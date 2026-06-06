import "../scss/errors.scss" //scss file, for styling
import "../scss/common-classes.scss"
import { useState } from "react" //allows re-render
import { useTranslation } from 'react-i18next';

function ErrorMessage({error}){
    if (!error)
        return (null);
    return (
        <div className="alert alert-danger rounded">{t(error)}</div> 
    )
}
export default ErrorMessage;