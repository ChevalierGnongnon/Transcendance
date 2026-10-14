import { useTranslation } from "react-i18next";

function TermsOfService() {
  const { t } = useTranslation();

  return (
    <main className="container my-5">
      <article>
        <p>
          <strong>{t("terms-of-service.title")}</strong>
        </p>

        <p>
          {t("terms-of-service.last-updated")}
        </p>

        <p>
          {t("terms-of-service.introduction")}
        </p>

        <p>
          <strong>
            {t("terms-of-service.acceptance.title")}
          </strong>
        </p>

        <p>
          {t("terms-of-service.acceptance.text")}
        </p>

        <p>
          <strong>
          {t("terms-of-service.service.title")}
          </strong>
        </p>

        <p>
          {t("terms-of-service.service.text")}
        </p>

        <p>
          <strong>
            {t("terms-of-service.accounts.title")}
          </strong>
        </p>

        <p>
          {t("terms-of-service.accounts.text")}
        </p>

        <p>
          <strong>
            {t("terms-of-service.acceptable-use.title")}
          </strong>
        </p>

        <p>
          {t("terms-of-service.acceptable-use.intro")}
        </p>

        <p>
          <strong>
            {t("terms-of-service.content.title")}
          </strong>
        </p>

        <p>
          {t("terms-of-service.content.text")}
        </p>

        <p>
          <strong>
            {t("terms-of-service.messaging.title")}
          </strong>
        </p>

        <p>
          {t("terms-of-service.messaging.text")}
        </p>

        <p>
          <strong>
            {t("terms-of-service.games.title")}
          </strong>
        </p>

        <p>
          {t("terms-of-service.games.text")}
        </p>

        <p>
          <strong>
            {t("terms-of-service.ai.title")}
          </strong>
        </p>

        <p>
          {t("terms-of-service.ai.text")}
        </p>

        <p>
          <strong>
            {t("terms-of-service.third-party.title")}
          </strong>
        </p>

        <p>
          {t("terms-of-service.third-party.text")}
        </p>

        <p>
          <strong>
            {t("terms-of-service.availability.title")}
          </strong>
        </p>

        <p>
          {t("terms-of-service.availability.text")}
        </p>

        <p>
          <strong>
            {t("terms-of-service.termination.title")}
          </strong>
        </p>

        <p>
          {t("terms-of-service.termination.text")}
        </p>

        <p>
          <strong>
            {t("terms-of-service.intellectual-property.title")}
          </strong>
        </p>

        <p>
          {t("terms-of-service.intellectual-property.text")}
        </p>

        <p>
          <strong>
            {t("terms-of-service.liability.title")}
          </strong>
        </p>

        <p>
          {t("terms-of-service.liability.text")}
        </p>

        <p>
          <strong>
            {t("terms-of-service.changes.title")}
          </strong>
        </p>

        <p>
          {t("terms-of-service.changes.text")}
        </p>

        <p>
          <strong>
            {t("terms-of-service.contact.title")}
          </strong>
        </p>

        <p>
          {t("terms-of-service.contact.text")}
        </p>

        <p>
          <a href={`mailto:${t("terms-of-service.contact.email")}`}>
            {t("terms-of-service.contact.email")}
          </a>
        </p>
      </article>
    </main>
  );
}

export default TermsOfService;
