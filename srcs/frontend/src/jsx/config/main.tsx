import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Login from "../register-and-login/login";
import PersonalPage from "../account/personal-page";
import RegisterFlow from "../register-and-login/register-flow";
import Parameters from '../account/parameters';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppHeader from '../headers/app-header'
import { AuthProvider } from '../auth/auth-context'
import { RequireAuth } from "../auth/require-auth";
import { GuestOnly } from "../auth/guest-only";
import Messages from "../messages/main-page"
import AddFriend from "../friends/add-friend"
import MyFriends from "../friends/my-friends";
import GameStart from "../../game/gomoku/GameStart"
import GamePage from "../../game/gomoku/GamePage";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<AppHeader />
				<Routes>
					<Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
					<Route path="/register" element={<GuestOnly><RegisterFlow /></GuestOnly>} />
					<Route path="/personalpage" element={<RequireAuth><PersonalPage /></RequireAuth>} />
					<Route path="/parameters" element={<RequireAuth><Parameters /></RequireAuth>} />
					<Route path="/messages" element={<RequireAuth><Messages /></RequireAuth>} />
					<Route path="/addfriend" element={<RequireAuth><AddFriend /></RequireAuth>} />
					<Route path="/myfriends" element={<RequireAuth><MyFriends /></RequireAuth>} />
					<Route path="/" element={<GuestOnly><Login/></GuestOnly>} />
					<Route path="/game/gomoku" element={<RequireAuth><GameStart /></RequireAuth>} />
					<Route path="/game" element={<RequireAuth><GamePage /></RequireAuth>} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>
);
