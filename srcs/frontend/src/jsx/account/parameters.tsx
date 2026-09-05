import "../../scss/common-classes.scss";
import "../../scss/parameters.scss";
import i18n from "../../../localisation/i18n";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import FileImport from "../files/file-import";
import ErrorMessage from "../others/error-message";
import { useState, useEffect } from "react";

interface DefaultAvatar {
	id: string;
	name: string;
}

function Parameters() {
	const { t } = useTranslation();
	const [error, setError] = useState<string | null>(null);

	const [defaultAvatars, setDefaultAvatars] = useState<DefaultAvatar[]>([]);
	const [avatar, setAvatar] = useState<string | null>(null);
	const [hasCustomFile, setHasCustomFile] = useState<boolean>(false);
	const [pickedDefault, setPickedDefault] = useState<boolean>(false);
	const [updated, setUpdated] = useState<boolean>(false);

	const manageAvatarUpdate = async () => {
		try {
			const response = await fetch("/api/my-profile/avatar", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ avatar }),
			});
			const data = await response.json();
			if (response.ok) {
				setUpdated(true);
			} else {
				setError(data.error);
			}
		} catch (err) {
			setError("DATABASE_ERROR");
		}
	};

	useEffect(() => {
		fetch("/api/default-avatars")
			.then((res) => res.json())
			.then((data: DefaultAvatar[]) => setDefaultAvatars(data))
			.catch(() => setError("FETCH_DEFAULT_AVATARS_ERROR"));
	}, []);
	return (
		<>
			<main className="d-flex flex-column justify-content-center align-items-center">
				<div className="row justify-content-center mt-4 g-3 update-main-div">
					<h2>{t("common.parameters")}</h2>
					<div className="col-12 col-lg-6 d-flex justify-content-center">
						<form className="parameters-form d-flex flex-column align-items-center justify-content-center gap-3">
							<h3>{t("update-my-profile.change-account-infos")}</h3>
							<span>{t("update-my-profile.change-first-name")}:</span>
							<input
								type="text"
								name="first_name"
								id="first_name"
								className="update-input form-control"
							/>
							<span>{t("update-my-profile.change-last-name")}:</span>
							<input
								type="text"
								name="last_name"
								id="last_name"
								className="update-input form-control"
							/>
							<span>{t("update-my-profile.change-pseudo")}:</span>
							<input
								type="text"
								name="pseudo"
								id="pseudo"
								className="update-input form-control"
							/>
							<div className="form-check d-flex align-items-center justify-content-center gap-2">
								<input
									type="radio"
									name=""
									id=""
									className="form-check-input mt-0"
								/>
								<span>Display name and last name</span>
							</div>
							<input
								type="button"
								value={t("update-my-profile.change-account-infos")}
								className="btn btn-primary update-button text-wrap"
							/>
						</form>
					</div>

					<div className="col-12 col-lg-4 d-flex flex-column align-items-center gap-3 h-100">
						<form className="parameters-form d-flex flex-column align-items-center justify-content-center gap-3">
							<h3>{t("update-my-profile.change-profile-photo")}</h3>
							
							{ !pickedDefault && 
								<FileImport
									mode="avatar"
									onUploaded={(fileId) => setAvatar(fileId)}
									onSelectedChange={setHasCustomFile}
								/>
							}

							{	!hasCustomFile &&
								<>
									<span>{t("complete-your-profile.choose-an-avatar")}</span>
									<div className="d-flex gap-2 justify-content-center flex-wrap avatar-grid">
										{ defaultAvatars.map((item) => (
											<img
												key={item.id}
												src={`/api/${item.id}/download`}
												alt={item.name}
												className={`img-avatar-completeProfile ${avatar === item.id ? "selected" : ""}`}
												onClick={() => { setAvatar(item.id); setPickedDefault(true); setUpdated(false); }}
											/>
										))}
									</div>
									
								</>
							}
							{	pickedDefault && (
								<>
									<input
										type="button"
										value={t('common.import-file-instead')}
										onClick={()=>{ setPickedDefault(false); setAvatar(null); setUpdated(false); }}
										className="undo_button"
									/>
									<input
										type="button"
										value={t("update-my-profile.change-profile-photo")}
										className="btn btn-primary update-button text-wrap"
										onClick={manageAvatarUpdate}
									/>
									{updated && <span className="d-block text-center text-white">✓ {t('common.updated')}</span>}
								</>
							)}
							<ErrorMessage error={error} />
							
							
						</form>

						<form className="danger-zone d-flex flex-column align-items-center justify-content-center gap-3 flex-fill">
							<h3>{t("update-my-profile.danger-zone")}</h3>
							<input
								type="button"
								value={t("update-my-profile.delete-my-game-infos")}
								className="btn btn-primary update-button text-wrap"
							/>
						</form>
					</div>
				</div>
			</main>
		</>
	);
}

export default Parameters;
