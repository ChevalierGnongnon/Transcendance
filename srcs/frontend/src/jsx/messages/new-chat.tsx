import { useTranslation } from 'react-i18next';

import '../../scss/messages.scss';

function NewChat() {
  const { t } = useTranslation();

  return (
    <form className="form-new-chat p-3 my-2 gap-3 d-flex flex-column justify-content-center align-items-center">
      <h1>{t('message.new-message')}</h1>
      <h3>{t('message.search-user')} : </h3>
      <input
        type="search"
        name="search-recipient"
        id="search-recipient"
        className="search-input"
        placeholder={t('common.search-user')}
      />
      <input type="button" value={t('common.search')} className="new-msg-button btn btn-primary" />
      <h3>{t('message.type-your-message')} :</h3>
      <textarea name="message" id="message" className="new-message"></textarea>
      <input type="button" value={t('common.send')} className="new-msg-button btn btn-primary" />
    </form>
  );
}

export default NewChat;
