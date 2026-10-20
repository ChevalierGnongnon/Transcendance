import { useTranslation } from "react-i18next";

function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <main className="container my-5">
      <article
        className="mx-auto"
        style={{ maxWidth: "1000px" }}
      >

        <p>
          <strong>
            {t("privacy-policy.title")}
          </strong>
        </p>

        <p>
          <strong>
            {t("privacy-policy.last-updated")}
          </strong>
        </p>

        <p>
          {t("privacy-policy.introduction.text")}
        </p>

        <p>
          <strong>
            {t("privacy-policy.information.title")}
          </strong>
        </p>

        <p>
          <strong>
            {t("privacy-policy.information.account.title")}
          </strong>
        </p>

        <p>
          {t("privacy-policy.information.account.text")}
        </p>

        <p>
          <strong>
            {t("privacy-policy.information.profile.title")}
          </strong>
        </p>

        <p>
          {t("privacy-policy.information.profile.text")}
        </p>

        <p>
          <strong>
            {t("privacy-policy.information.messages.title")}
          </strong>
        </p>

        <p>
          {t("privacy-policy.information.messages.text")}
        </p>

        <p>
          <strong>
            {t("privacy-policy.information.game.title")}
          </strong>
        </p>

        <p>
          {t("privacy-policy.information.game.text")}
        </p>

        <p>
          <strong>
            {t("privacy-policy.information.ai.title")}
          </strong>
        </p>

        <p>
          {t("privacy-policy.information.ai.text")}
        </p>

        <p>
          <strong>
            {t("privacy-policy.information.analytics.title")}
          </strong>
        </p>

        <p>
          {t("privacy-policy.information.analytics.text")}
        </p>

        <p>
          <strong>
            {t("privacy-policy.information.technical.title")}
          </strong>
        </p>

        <p>
          {t("privacy-policy.information.technical.text")}
        </p>

        <p>
          <strong>
            {t("privacy-policy.usage.title")}
          </strong>
        </p>

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

        <p>
          <strong>
            {t("privacy-policy.ai-services.title")}
          </strong>
        </p>

        <p>
          {t("privacy-policy.ai-services.text")}
        </p>

        <p>
          {t("privacy-policy.ai-services.accuracy")}
        </p>

        <p>
          {t("privacy-policy.ai-services.sensitive-data")}
        </p>

        <p>
          <strong>
            {t("privacy-policy.third-party.title")}
          </strong>
        </p>

        <p>
          {t("privacy-policy.third-party.text")}
        </p>

        <p>
          <strong>
            {t("privacy-policy.cookies.title")}
          </strong>
        </p>

        <p>
          {t("privacy-policy.cookies.text")}
        </p>

        <p>
          <strong>
            {t("privacy-policy.retention.title")}
          </strong>
        </p>

        <p>
          {t("privacy-policy.retention.text")}
        </p>

        <p>
          <strong>
            {t("privacy-policy.security.title")}
          </strong>
        </p>

        <p>
          {t("privacy-policy.security.text")}
        </p>

        <p>
          <strong>
            {t("privacy-policy.rights.title")}
          </strong>
        </p>

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

        <p>
          <strong>
            {t("privacy-policy.deletion.title")}
          </strong>
        </p>

        <p>
          {t("privacy-policy.deletion.text")}
        </p>

        <p>
          <strong>
            {t("privacy-policy.changes.title")}
          </strong>
        </p>

        <p>
          {t("privacy-policy.changes.text")}
        </p>

      </article>
    </main>
  );
}

export default PrivacyPolicy;
