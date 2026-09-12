import { Navigate, useNavigate } from "react-router-dom";
import i18n from "../../../localisation/i18n";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/auth-context";

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
    <footer className="footer">
      <div>
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
      <div>
        <span onClick={() => navigate("/termsofservice")}>
          {t("common.terms-of-service")}
        </span>
        <span onClick={() => navigate("/privacypolicy")}>
          {t("common.privacy-policy")}
        </span>
      </div>

      {isAuthenticated && (
        <div className="div-connected-only">
          <input
            type="button"
            value={t("common.my-page")}
            className="shortcut-button"
            onClick={() => navigate("/personalpage")}
          />
          <input
            type="button"
            value={t("common.parameters")}
            className="shortcut-button"
            onClick={() => navigate("/parameters")}
          />
          <input
            type="button"
            value={t("common.my-friends")}
            className="shortcut-button"
            onClick={() => navigate("/myfriends")}
          />
          <input
            type="button"
            value={t("common.my-messages")}
            className="shortcut-button"
            onClick={() => navigate("/messages")}
          />
          <input
            type="button"
            value={t("common.logout")}
            className="shortcut-button"
            onClick={handleLogout}
          />
        </div>
      )}

    {!isAuthenticated &&
        <div>
            <input
                type="button"
                value={t("common.login")}
                className="shortcut-button"
                onClick={() => navigate("/login")}
            />
            <input
                type="button"
                value={t("common.register")}
                className="shortcut-button"
                onClick={() => navigate("/register")}
            />
        </div>
    }
    </footer>
  );
}

export default Footer;
