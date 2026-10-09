import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth-context";
import "../../scss/common-classes.scss"
function PageNotFound(){
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();

    return (
        <>
            <h1 className="page-not-found">404</h1>
            <h2 className="page-not-found">{t('common.page-not-found')}</h2>

            { isAuthenticated &&
                <input
                    type="button"
                    value={t('common.go-back-my-page')}
                    className="go-back-login"
                    onClick={() => navigate("/")}
                />
            }
            { isAuthenticated === false && 
                <input
                    type="button"
                    value={t('common.go-back-login')}
                    className="go-back-login"
                    onClick={() => navigate("/login")}
                />
            }

            
        </>
    )
}

export default PageNotFound;