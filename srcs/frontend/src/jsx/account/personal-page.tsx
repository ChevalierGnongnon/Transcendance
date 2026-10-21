import "../../scss/common-classes.scss";
import "../../scss/profile-page.scss";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import messageIcon from "../../assets/icons/icon-messages.png";
import updateShortcut from "../../assets/icons/icon-update.png";
import playShortcut from "../../assets/icons/play-shortcut.png";
import iconFriendList from "../../assets/icons/icon-friend-list.png";
import statsShortcut from "../../assets/icons/stats.png"
import { useAuth } from "../auth/auth-context";
import { useParams } from "react-router-dom";
import { useFriendships } from "../friends/useFriendships";

import PageNotFound from "../others/404-not-found";
import ErrorMessage from "../others/error-message";
import ProfileShortcuts from './shortcuts/ProfileShortcuts';

interface User {
	id: string;
	firstName: string;
	lastName: string;
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
	const { getStatus } = useFriendships(); 
	const [notFound, setNotFound] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect (() => {
		async function checkProfileOwner(){
			setNotFound(false);
			setError(null);
			try{
				if (pseudo !== undefined){
					const displayedUserInfos = await fetch(`/api/users/${pseudo}`, {credentials: "include"});
					if (!displayedUserInfos.ok) {
						if (displayedUserInfos.status === 404){
							setNotFound(true);
							return ;
						}
						setDisplayedUser(null);
						setError('IMPOSSIBLE_LOADING_ACCOUNT')
						return;
					}
					const data = await displayedUserInfos.json();
					setDisplayedUser(data);
				}
				else {
					const res = await fetch('/api/my-profile', { credentials: "include" });
					if (!res.ok) {
						setDisplayedUser(null);
						setError('IMPOSSIBLE_LOADING_ACCOUNT');
						return;
					}
					const data = await res.json();
					setDisplayedUser(data);
				}
			} catch (err) {
				console.error('my-profile error:', err);
				setDisplayedUser(null);
				setError('IMPOSSIBLE_LOADING_ACCOUNT');
			}
		}
		checkProfileOwner();
	}, [pseudo])

	useEffect(() => {
		async function loadProfile() {
			try {
				const res = await fetch('/api/my-profile', {
					credentials: "include"
				});
				if (!res.ok){
					if (res.status === 401)
						await logout();
					return ;
				}
				const data = await res.json();
				setUser(data);
			} catch (err) {
				console.error('my-profile error:', err);
			}
		}
		loadProfile();
	}, []);

	const isMine = pseudo === undefined || user?.pseudo === pseudo;


	const handlePlay = async () => {
		try {
			const response = await fetch('/api/my-active-game', { credentials: 'include' });
			if (response.ok) {
				const activeGame = await response.json();
				if (activeGame?.gameId && activeGame?.opponentId && activeGame?.boardSize) {
					navigate(`/game?gameId=${activeGame.gameId}&opponentId=${activeGame.opponentId}&boardSize=${activeGame.boardSize}`);
					return;
				}
			}
		} catch (error) {
			console.error('Failed to check for an active game:', error);
		}
		navigate('/game/gomoku');
	};
	if (notFound)
		return (<PageNotFound></PageNotFound>)

	if (!displayedUser){
		if (error === null)
			return (<p>{t("common.loading")}</p>);
		else
			return(<ErrorMessage error={error}></ErrorMessage>)
	}


	return (
		<>
			<main className="d-flex flex-column justify-content-center align-items-center">
				<div className="profile-page d-flex flex-column gap-3 justify-content-center align-items-center min-vh-100">
					{isMine &&
						<>
							<img
								src={
									displayedUser.profilePhoto?.id
										? `/api/${displayedUser.profilePhoto.id}/download`
										: "/default-avatar.png"
								}
								alt={t('alt.avatar')}
								className="img-avatar-profile-page my-avatar"
							/>
							<div className="d-flex flex-column">
								<h1>{displayedUser.pseudo}</h1>
								<span>
									{displayedUser.firstName} {displayedUser.lastName}
								</span>
							</div>
						</>
					}
					{!isMine &&
						<>
							<img
								src={
									displayedUser.profilePhoto?.id
										? `/api/${displayedUser.profilePhoto.id}/download`
										: "/default-avatar.png"
								}
								alt={t('alt.avatar')}
								className={`img-avatar-profile-page ${getStatus(displayedUser.id)}-avatar`}
							/>
							<div className="d-flex flex-column">
								<h1>{displayedUser.pseudo}</h1>
								<span>
									{displayedUser.firstName} {displayedUser.lastName}
								</span>
							</div>
						</>
					}


					{!isMine && <ProfileShortcuts user={displayedUser} /> }

					{isMine &&
						<>
							<span>{t("profile-page.navigate")}</span>
							<div className="row g-4 justify-content-center shortcut-grid">
								<div className="col-12 col-md-6 col-xl-4">
									<figure className="shortcut-icon justify-content-center">
										<img src={messageIcon} alt={t('alt.messages')} onClick={() => navigate("/messages")} />
										<span>{t("common.messages")}</span>
									</figure>
								</div>
								<div className="col-12 col-md-6 col-xl-4">
									<figure
										className="shortcut-icon justify-content-center"
										onClick={() => navigate("/Parameters")}
									>
										<img src={updateShortcut} alt={t('alt.parameters')} />
										<span>{t("common.parameters")}</span>
									</figure>
								</div>
								<div className="col-12 col-md-6 col-xl-4" onClick={handlePlay}>
									<figure className="shortcut-icon justify-content-center">
										<img src={playShortcut} alt={t('alt.play')} />
										<span>{t("common.play")}</span>
									</figure>
								</div>
							</div>
						</>
					}
					
					{isMine && 
						<>
							<div className="row g-4 justify-content-center shortcut-grid">
								<div className="col-12 col-md-6 col-xl-6">
									<figure className="shortcut-icon justify-content-center" onClick={() => navigate("/myfriends")}>
										<img src={iconFriendList} alt={t('alt.friend-list')} />
										<span>{t("profile-page.friend-list")}</span>
									</figure>
								</div>

								<div className="col-12 col-md-6 col-xl-6">
									<figure className="shortcut-icon justify-content-center" onClick={() => navigate("/analytics")}>
										<img src={statsShortcut} alt={t('alt.analytics')} />
										<span>{t('analytics.title')}</span>
									</figure>
								</div>
							</div>
						</>
					}
					
				</div>
			</main>
		</>
	);
}
export default PersonalPage;
