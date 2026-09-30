import { useTranslation } from "react-i18next";

function TermsOfService() {
  const { t } = useTranslation();

  return (
    <main className="container my-5">
      <article>
        <h1>{t("terms-of-service.title")}</h1>

        <p className="text-muted">
          {t("terms-of-service.last-updated")}
        </p>

        <section>
          <h2>{t("terms-of-service.acceptance.title")}</h2>

          <p>
            {t("terms-of-service.acceptance.text")}
          </p>
        </section>

        <section>
          <h2>{t("terms-of-service.service.title")}</h2>

          <p>
            {t("terms-of-service.service.text")}
          </p>
        </section>
      </article>
    </main>
  );
}

export default TermsOfService;