import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/auth-context";
import "../../scss/footer.scss"

function Footer() {
  const { logout, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <footer className="fixed-bottom common-footer d-flex flex-column align-items-center gap-3 p-2">
      <nav
            className="d-flex flex-wrap justify-content-center gap-3"
            aria-label={t("common.legal-navigation")}
        >
            <Link className="link" to="/termsofservice">
                {t("common.terms-of-service")}
            </Link>

            <Link className="link" to="/privacypolicy">
                {t("common.privacy-policy")}
            </Link>
        </nav>

      {isAuthenticated && (
        <div className="div-connected-only d-flex gap-2 d-none d-md-flex">
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

    {isAuthenticated === false &&
        <div className="d-flex gap-2">
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
