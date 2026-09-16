import { useTranslation } from "react-i18next";
import "../../scss/messages.scss";

function MoreOptions({ opponentId, navigate }) {
  const { t } = useTranslation();

  return (
    <div className="more-options-div gap-1 d-flex flex-column align-items-center">
      
      <input
        type="button"
        value={t('message.upload-file')}
        className="btn btn-primary more-options-btn"
      />

      <input
        type="button"
        value={t('message.invite-to-game')}
        className="btn btn-primary more-options-btn"
        onClick={() => {
          navigate('/game/gomoku', {
            state: { opponentId }
          });
        }}
      />
    </div>
  );
}

// function MoreOptions(){
//     const {t} = useTranslation();
//     return(
//         <div className="more-options-div gap-1 d-flex flex-column align-items-center">
//             <input type="button" value={t('message.upload-file')} className="btn btn-primary more-options-btn" />
//             <input type="button" value={t('message.invite-to-game')} className="btn btn-primary more-options-btn" />
//         </div>
//     )

// }

export default MoreOptions;

