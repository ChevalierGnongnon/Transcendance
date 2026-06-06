import "../scss/common-classes.scss"
import { useTranslation } from 'react-i18next';

function ErrorMessage({error}){
    const {t} = useTranslation();

    if (!error)
        return (null);
    return (
        <div className="alert alert-danger error-message">{t('errors.' + error)}</div>
    )
}
export default ErrorMessage;