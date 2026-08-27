import "../../scss/common-classes.scss";
import "../../scss/profile-page.scss";
import i18n from "../../../localisation/i18n";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import messageIcon from "../../assets/icons/icon-messages.png";
import updateShortcut from "../../assets/icons/icon-update.png";
import playShortcut from "../../assets/icons/play-shortcut.png";
import addFriendsIcon from "../../assets/icons/icon-add-friends.png";
import iconFriendList from "../../assets/icons/icon-friend-list.png";
import { useAuth } from "../auth/auth-context";

interface User {
	firstName: string;
	lastName: string;
	email: string;
	pseudo: string;
	profilePhoto: {
		name: string;
	};
}

function PersonalPage() {
	const {logout} = useAuth();
	const [user, setUser] = useState<User | null>(null);
	const { t } = useTranslation();
	const navigate = useNavigate();

	useEffect(() => {
		async function loadProfile() {
			const res = await fetch('/api/my-profile', {
				credentials: "include"
			});
			if (!res.ok){
				await logout();
				return ;
			}
			const data = await res.json();
			setUser(data);
		}
		loadProfile();
	}, []);

	if (!user) return <p>{t("common.loading")}</p>;
	return (
		<>
			<main className="d-flex flex-column justify-content-center align-items-center">
				<div className="profile-page d-flex flex-column gap-3 justify-content-center align-items-center min-vh-100">
					<img
						src={
							user.profilePhoto?.name
								? `/uploads/${user.profilePhoto.name}`
								: "/default-avatar.png"
						}
						alt="avatar"
						className="img-avatar-profile-page"
					/>
					<div className="d-flex flex-column">
						<h1>{user.pseudo}</h1>
						<span>
							{user.firstName} {user.lastName}
						</span>
					</div>

					<span>{t("profile-page.go-to")}</span>
					<div className="row g-4 justify-content-center shortcut-grid">
						<div className="col-12 col-md-6 col-xl-4">
							<figure className="shortcut-icon justify-content-center">
								<img src={messageIcon} alt="message-shortcut" onClick={() => navigate("/messages")} />
								<span>{t("common.messages")}</span>
							</figure>
						</div>
						<div className="col-12 col-md-6 col-xl-4">
							<figure
								className="shortcut-icon justify-content-center"
								onClick={() => navigate("/Parameters")}
							>
								<img src={updateShortcut} alt="message-shortcut" />
								<span>{t("common.parameters")}</span>
							</figure>
						</div>
						<div className="col-12 col-md-6 col-xl-4" onClick={() => navigate('/game/gomoku')}>
							<figure className="shortcut-icon justify-content-center">
								<img src={playShortcut} alt="play-shortcut" />
								<span>{t("common.play")}</span>
							</figure>
						</div>
					</div>

					<span>{t("profile-page.my-friends")}</span>
					<div className="row g-4 justify-content-center shortcut-grid">
						<div className="col-12 col-md-6 col-xl-6">
							<figure className="shortcut-icon justify-content-center" onClick={() => navigate("/myfriends")}>
								<img src={iconFriendList} alt="message-shortcut" />
								<span>{t("profile-page.friend-list")}</span>
							</figure>
						</div>
						<div className="col-12 col-md-6 col-xl-6">
							<figure className="shortcut-icon justify-content-center" onClick={() => navigate("/addfriend")}>
								<img src={addFriendsIcon} alt="message-shortcut" />
								<span>{t("profile-page.add-friend")}</span>
							</figure>
						</div>
					</div>

					<span>{t("profile-page.game-stats")}</span>
					{/* <div className="d-flex gap-2 justify-content-center flex-wrap shortcut-grid">
                        <figure className="shortcut-icon justify-content-center">
                            <h1>{user.games_played}</h1>
                            <span>{t('profile-page.games-played')}</span>
                        </figure>
                        <figure className="shortcut-icon justify-content-center">
                            <h1>{user.games_won}</h1>
                            <span>{t('profile-page.games-won')}</span>
                        </figure>
                        <figure className="shortcut-icon justify-content-center">
                             <h1>{user.games_lost}</h1>
                            <span>{t('profile-page.games-lost')}</span>
                        </figure>
                        <figure className="shortcut-icon justify-content-center">
                             <h1>{user.best_score}</h1>
                            <span>{t('profile-page.best-score')}</span>
                        </figure>
                    </div> */}
				</div>
			</main>
		</>
	);
}
export default PersonalPage;
