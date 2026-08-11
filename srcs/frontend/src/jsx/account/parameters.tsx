import "../../scss/common-classes.scss";
import "../../scss/parameters.scss";
import i18n from '../../../localisation/i18n';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";

interface DefaultAvatar {
	file_id: string;
	file_name: string;
}

function Parameters() {
    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);
    
    const [defaultAvatars, setDefaultAvatars] = useState<DefaultAvatar[]>([]);
    const [avatar, setAvatar] = useState<string | null>(null);

    useEffect(() => {
            fetch('/api/default-avatars')
                .then(res => res.json())
                .then((data: DefaultAvatar[]) => setDefaultAvatars(data))
                .catch(() => setError('FETCH_DEFAULT_AVATARS_ERROR'));
    }, []);
    return (
        <>
            <main className="d-flex flex-column justify-content-center align-items-center">
                <div className="row justify-content-center mt-4 g-3 update-main-div">
                    <h2>{t('update-my-profile.update-my-profile')}</h2>
                    <div className="col-12 col-md-4 d-flex justify-content-center">
                        <form className="parameters-form d-flex flex-column align-items-center justify-content-center gap-3">
                            <h3>{t('update-my-profile.change-my-password')}</h3>
                            <span>{t('update-my-profile.old-password')}:</span>
                            <input type="password" name="old_password" id="old_password" className="update-input form-control"/>
                            <span>{t('update-my-profile.new-password')}:</span>
                            <input type="password" name="new_password" id="new_password" className="update-input form-control"/>
                            <span>{t('update-my-profile.confirm-password')}:</span>
                            <input type="password" name="password_verify" id="password_verify" className="update-input form-control"/>
                            <input type="button" value={t('update-my-profile.change-my-password')} className="btn btn-primary update-button text-wrap"/>
                        </form>
                    </div>

                    <div className="col-12 col-md-4 d-flex justify-content-center">
                        <form className="parameters-form d-flex flex-column align-items-center justify-content-center gap-3">
                            <h3>{t('update-my-profile.change-account-infos')}</h3>
                            <span>{t('update-my-profile.change-first-name')}:</span>
                            <input type="text" name="first_name" id="first_name" className="update-input form-control" />
                            <span>{t('update-my-profile.change-last-name')}:</span>
                            <input type="text" name="last_name" id="last_name" className="update-input form-control"/>
                            <span>{t('update-my-profile.change-pseudo')}:</span>
                            <input type="text" name="pseudo" id="pseudo" className="update-input form-control"/>
                            <div className="form-check d-flex align-items-center justify-content-center gap-2">
                                <input type="radio" name="" id="" className="form-check-input mt-0"/>
                                <span>Display name and last name</span>
                            </div>
                            <input type="button" value={t('update-my-profile.change-account-infos')} className="btn btn-primary update-button text-wrap"/>
                        </form>
                    </div>

                    <div className="col-12 col-md-4 d-flex flex-column align-items-center gap-3 h-100">
                        <form className="parameters-form d-flex flex-column align-items-center justify-content-center gap-3">
                            <h3>{t('update-my-profile.change-profile-photo')}</h3>
                            <label htmlFor="avatar" className="btn btn-secondary btn-sm">
                                {t('complete-your-profile.upload-avatar')}
                            </label>
				            <input type="file" id="avatar" accept="image/*" style={{ display: 'none' }} />
                            <span>{t('complete-your-profile.choose-an-avatar')}</span>
                            <div className="d-flex gap-2 justify-content-center flex-wrap avatar-grid">
                                {defaultAvatars.map((item) => (
                                    <img key={item.file_id} src={`/uploads/${item.file_name}`} alt={item.file_name} className={`img-avatar ${avatar === item.file_id ? 'selected' : ''}`} onClick={() => setAvatar(item.file_id)} />
                                ))}
				            </div>
                            <input type="button" value={t('update-my-profile.change-profile-photo')} className="btn btn-primary update-button text-wrap"/>
                        </form>

                        <form className="danger-zone d-flex flex-column align-items-center justify-content-center gap-3 flex-fill">
                            <h3>{t('update-my-profile.danger-zone')}</h3>
                            <input type="button" value={t('update-my-profile.delete-my-game-infos')} className="btn btn-primary update-button text-wrap" />
                            <input type="button" value={t('update-my-profile.delete-my-account')} className="btn btn-primary update-button text-wrap" />
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Parameters;