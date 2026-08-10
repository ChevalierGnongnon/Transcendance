import "../../scss/common-classes.scss";
import "../../scss/parameters.scss";
import i18n from '../../../localisation/i18n';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";

function Parameters() {
    const { t } = useTranslation();

    return (
        <>
            <main className="d-flex flex-column justify-content-center align-items-center">
                <div className="row justify-content-center mt-4 g-3 update-main-div">
                    <h2>{t('update-my-profile.update-my-profile')}</h2>
                    <div className="col-12 col-md-4 d-flex justify-content-center">
                        <form className="parameters-form d-flex flex-column align-items-center gap-3">
                            <h3>{t('update-my-profile.change-my-password')}</h3>
                            <span>{t('update-my-profile.old-password')}:</span>
                            <input type="password" name="old_password" id="old_password" className="update-input"/>
                            <span>{t('update-my-profile.new-password')}:</span>
                            <input type="password" name="new_password" id="new_password" className="update-input"/>
                            <span>{t('update-my-profile.confirm-password')}:</span>
                            <input type="password" name="password_verify" id="password_verify" className="update-input"/>
                            <input type="button" value={t('update-my-profile.change-my-password')} />
                        </form>
                    </div>

                    <div className="col-12 col-md-4 d-flex justify-content-center">
                        <form className="parameters-form d-flex flex-column align-items-center gap-3">
                            <h3>{t('update-my-profile.change-account-infos')}</h3>
                            <span>{t('update-my-profile.change-first-name')}:</span>
                            <input type="text" name="first_name" id="first_name" className="update-input" />
                            <span>{t('update-my-profile.change-last-name')}:</span>
                            <input type="text" name="last_name" id="last_name" className="update-input"/>
                            <span>{t('update-my-profile.change-pseudo')}:</span>
                            <input type="text" name="pseudo" id="pseudo" className="update-input"/>
                            <input type="button" value={t('update-my-profile.change-account-infos')} className="update-input"/>
                        </form>
                    </div>

                    <div className="col-12 col-md-4 d-flex flex-column align-items-center gap-3 h-100">
                        <form className="parameters-form d-flex flex-column align-items-center gap-3">
                            <h3>{t('update-my-profile.change-profile-photo')}</h3>
                            <input type="file" name="profile_photo" id="profile_photo" />
                            <input type="button" value={t('update-my-profile.change-profile-photo')} className="update-input"/>
                        </form>

                        <form className="danger-zone d-flex flex-column align-items-center justify-content-center gap-3 flex-fill">
                            <h3>{t('update-my-profile.danger-zone')}</h3>
                            <input type="button" value={t('update-my-profile.delete-my-account')} />
                        </form>
                    </div>
                </div>
                
            </main>
        </>
    )
}

export default Parameters;