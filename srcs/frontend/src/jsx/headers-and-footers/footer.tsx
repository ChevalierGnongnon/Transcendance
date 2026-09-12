import { Navigate, useNavigate } from "react-router-dom";
import i18n from "../../../localisation/i18n";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/auth-context";
import "../../scss/footer.scss"

function Footer() {
  const { logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <footer className="common-footer d-flex flex-column align-items-center gap-3">
      <div className="d-flex">
        <input
          type="button"
          value="Fr"
          className="btn btn-secondary header-btn btn-sm"
          onClick={() => {
            i18n.changeLanguage("fr");
            localStorage.setItem("lang", "fr");
          }}
        />
        <input
          type="button"
          value="Eng"
          className="btn btn-secondary header-btn btn-sm"
          onClick={() => {
            i18n.changeLanguage("en");
            localStorage.setItem("lang", "en");
          }}
        />
        <input
          type="button"
          value="De"
          className="btn btn-secondary header-btn btn-sm"
          onClick={() => {
            i18n.changeLanguage("de");
            localStorage.setItem("lang", "de");
          }}
        />
        <input
          type="button"
          value="Ru"
          className="btn btn-secondary header-btn btn-sm"
          onClick={() => {
            i18n.changeLanguage("ru");
            localStorage.setItem("lang", "ru");
          }}
        />
        <input
          type="button"
          value="Ua"
          className="btn btn-secondary header-btn btn-sm"
          onClick={() => {
            i18n.changeLanguage("uk");
            localStorage.setItem("lang", "uk");
          }}
        />
      </div>
      <div className="d-flex gap-2">
        <a className="link" onClick={() => navigate("/termsofservice")}>
          {t("common.terms-of-service")}
        </a>
        <a className="link" onClick={() => navigate("/privacypolicy")}>
          {t("common.privacy-policy")}
        </a>
      </div>

      {isAuthenticated && (
        <div className="div-connected-only d-flex gap-2">
          <input
            type="button"
            value={t("common.my-page")}
            className="btn btn-primary"
            onClick={() => navigate("/personalpage")}
          />
          <input
            type="button"
            value={t("common.parameters")}
            className="btn btn-primary"
            onClick={() => navigate("/parameters")}
          />
          <input
            type="button"
            value={t("common.my-friends")}
            className="btn btn-primary"
            onClick={() => navigate("/myfriends")}
          />
          <input
            type="button"
            value={t("common.my-messages")}
            className="btn btn-primary"
            onClick={() => navigate("/messages")}
          />
          <input
            type="button"
            value={t("common.logout")}
            className="btn btn-primary"
            onClick={handleLogout}
          />
        </div>
      )}

    {!isAuthenticated &&
        <div className="d-flex">
            <input
                type="button"
                value={t("common.login")}
                className="btn btn-primary"
                onClick={() => navigate("/login")}
            />
            <input
                type="button"
                value={t("common.register")}
                className="btn btn-primary"
                onClick={() => navigate("/register")}
            />
        </div>
    }
    </footer>
  );
}

export default Footer;
