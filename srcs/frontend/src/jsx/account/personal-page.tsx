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
import statsShortcut from "../../assets/icons/stats.png"
import { useAuth } from "../auth/auth-context";
import { useParams } from "react-router-dom";
import { useApiFetch } from "../auth/use-api-fetch";

interface User {
	firstName: string;
	lastName: string;
	email: string;
	pseudo: string;
	profilePhoto: {
		id: string;
		name: string;
	};
}

function PersonalPage() {
	const {logout} = useAuth();
	const [user, setUser] = useState<User | null>(null);
	const [displayedUser, setDisplayedUser] = useState<User | null>(null);
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { pseudo } = useParams();

	useEffect (() => {
		async function checkProfileOwner(){
			if (pseudo !== undefined){
				const displayedUserInfos = await fetch(`/api/users/${pseudo}`, {credentials: "include"});
				if (!displayedUserInfos.ok) {
					setDisplayedUser(null);
					return;
				}
				const data = await displayedUserInfos.json();
				setDisplayedUser(data);
			}
			else {
				const res = await fetch('/api/my-profile', { credentials: "include" });
				if (!res.ok) {
					setDisplayedUser(null);
					return;
				}
				const data = await res.json();
				setDisplayedUser(data);
			}

		}
		checkProfileOwner();
	}, [pseudo])

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

	const isMine = pseudo === undefined || user?.pseudo === pseudo;

	if (!displayedUser)
		return (<p>{t("common.loading")}</p>);
	return (
		<>
			<main className="d-flex flex-column justify-content-center align-items-center">
				<div className="profile-page d-flex flex-column gap-3 justify-content-center align-items-center min-vh-100">
					<img
						src={
							displayedUser.profilePhoto?.id
								? `/api/${displayedUser.profilePhoto.id}/download`
								: "/default-avatar.png"
						}
						alt="avatar"
						className="img-avatar-profile-page"
					/>
					<div className="d-flex flex-column">
						<h1>{displayedUser.pseudo}</h1>
						<span>
							{displayedUser.firstName} {displayedUser.lastName}
						</span>
					</div>

					<span>{t("profile-page.go-to")}</span>

					{ !isMine &&
						<div className="row g-4 justify-content-center shortcut-grid">
							<div className="col-12 col-md-6 col-xl-6">
								<figure className="shortcut-icon justify-content-center" onClick={() => navigate("/addfriend")}>
									<img src={addFriendsIcon} alt="message-shortcut" />
									<span>{t("profile-page.send-friendship-invitation")}</span>
								</figure>
							</div>

							<div className="col-12 col-md-6 col-xl-4">
								<figure className="shortcut-icon justify-content-center">
									<img src={playShortcut} alt="play-shortcut" />
									<span>{t("common.send-game-invitation")}</span>
								</figure>
							</div>
						</div>
					}

					{isMine &&
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
							<div className="col-12 col-md-6 col-xl-4">
								<figure className="shortcut-icon justify-content-center">
									<img src={playShortcut} alt="play-shortcut" />
									<span>{t("common.play")}</span>
								</figure>
							</div>
						</div>
					}
					
					{isMine && 
						<>
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
							<div className="col-12 col-md-6 col-xl-6">
								<figure className="shortcut-icon justify-content-center" onClick={() => navigate("/mystats")}>
								<img src={statsShortcut} alt="message-shortcut" />
								<span>{t("profile-page.my-stats")}</span>
							</figure>
						</div>
						</>
					}
					
				</div>
			</main>
		</>
	);
}
export default PersonalPage;
