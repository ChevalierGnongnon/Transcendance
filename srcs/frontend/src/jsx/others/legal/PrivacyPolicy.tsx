import { useTranslation } from "react-i18next";

function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <main className="container my-5">
      <article
        className="mx-auto"
        style={{ maxWidth: "1000px" }}
      >
        <h1 className="mb-4">
          {t("privacy-policy.title")}
        </h1>

        <p className="text-muted">
          <strong>
            {t("privacy-policy.last-updated")}
          </strong>
        </p>

        <section className="mb-4">
          <h2>
            {t("privacy-policy.introduction.title")}
          </h2>

          <p>
            {t("privacy-policy.introduction.text")}
          </p>
        </section>

        <section className="mb-4">
          <h2>
            {t("privacy-policy.information.title")}
          </h2>

          <h3>
            {t("privacy-policy.information.account.title")}
          </h3>

          <p>
            {t("privacy-policy.information.account.text")}
          </p>

          <h3>
            {t("privacy-policy.information.profile.title")}
          </h3>

          <p>
            {t("privacy-policy.information.profile.text")}
          </p>

          <h3>
            {t("privacy-policy.information.messages.title")}
          </h3>

          <p>
            {t("privacy-policy.information.messages.text")}
          </p>

          <h3>
            {t("privacy-policy.information.game.title")}
          </h3>

          <p>
            {t("privacy-policy.information.game.text")}
          </p>

          <h3>
            {t("privacy-policy.information.ai.title")}
          </h3>

          <p>
            {t("privacy-policy.information.ai.text")}
          </p>

          <h3>
            {t("privacy-policy.information.analytics.title")}
          </h3>

          <p>
            {t("privacy-policy.information.analytics.text")}
          </p>

          <h3>
            {t("privacy-policy.information.technical.title")}
          </h3>

          <p>
            {t("privacy-policy.information.technical.text")}
          </p>
        </section>

        <section className="mb-4">
          <h2>
            {t("privacy-policy.usage.title")}
          </h2>

          <p>
            {t("privacy-policy.usage.intro")}
          </p>

          <ul>
            <li>
              {t("privacy-policy.usage.items.accounts")}
            </li>
            <li>
              {t("privacy-policy.usage.items.authentication")}
            </li>
            <li>
              {t("privacy-policy.usage.items.messaging")}
            </li>
            <li>
              {t("privacy-policy.usage.items.games")}
            </li>
            <li>
              {t("privacy-policy.usage.items.ai")}
            </li>
            <li>
              {t("privacy-policy.usage.items.analytics")}
            </li>
            <li>
              {t("privacy-policy.usage.items.security")}
            </li>
            <li>
              {t("privacy-policy.usage.items.rate-limits")}
            </li>
            <li>
              {t("privacy-policy.usage.items.maintenance")}
            </li>
          </ul>
        </section>

        <section className="mb-4">
          <h2>
            {t("privacy-policy.ai-services.title")}
          </h2>

          <p>
            {t("privacy-policy.ai-services.text")}
          </p>

          <p>
            {t("privacy-policy.ai-services.accuracy")}
          </p>

          <p>
            {t("privacy-policy.ai-services.sensitive-data")}
          </p>
        </section>

        <section className="mb-4">
          <h2>
            {t("privacy-policy.third-party.title")}
          </h2>

          <p>
            {t("privacy-policy.third-party.text")}
          </p>
        </section>

        <section className="mb-4">
          <h2>
            {t("privacy-policy.cookies.title")}
          </h2>

          <p>
            {t("privacy-policy.cookies.text")}
          </p>
        </section>

        <section className="mb-4">
          <h2>
            {t("privacy-policy.retention.title")}
          </h2>

          <p>
            {t("privacy-policy.retention.text")}
          </p>
        </section>

        <section className="mb-4">
          <h2>
            {t("privacy-policy.security.title")}
          </h2>

          <p>
            {t("privacy-policy.security.text")}
          </p>
        </section>

        <section className="mb-4">
          <h2>
            {t("privacy-policy.rights.title")}
          </h2>

          <p>
            {t("privacy-policy.rights.intro")}
          </p>

          <ul>
            <li>
              {t("privacy-policy.rights.items.access")}
            </li>
            <li>
              {t("privacy-policy.rights.items.correction")}
            </li>
            <li>
              {t("privacy-policy.rights.items.deletion")}
            </li>
            <li>
              {t("privacy-policy.rights.items.restriction")}
            </li>
            <li>
              {t("privacy-policy.rights.items.objection")}
            </li>
            <li>
              {t("privacy-policy.rights.items.portability")}
            </li>
          </ul>

          <p>
            {t("privacy-policy.rights.contact")}
          </p>
        </section>

        <section className="mb-4">
          <h2>
            {t("privacy-policy.deletion.title")}
          </h2>

          <p>
            {t("privacy-policy.deletion.text")}
          </p>
        </section>

        <section className="mb-4">
          <h2>
            {t("privacy-policy.changes.title")}
          </h2>

          <p>
            {t("privacy-policy.changes.text")}
          </p>
        </section>

        <section className="mb-4">
          <h2>
            {t("privacy-policy.contact.title")}
          </h2>

          <p>
            {t("privacy-policy.contact.text")}
          </p>

          <p>
            <strong>
              {t("privacy-policy.contact.email")}
            </strong>
          </p>
        </section>
      </article>
    </main>
  );
}

export default PrivacyPolicy;

