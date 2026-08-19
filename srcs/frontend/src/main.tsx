import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Login from "./jsx/register-and-login/login";
import PersonalPage from "./jsx/account/personal-page";
import RegisterFlow from "./jsx/register-and-login/register-flow";
import Parameters from './jsx/account/parameters';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppHeader from './jsx/headers/app-header'
import { AuthProvider } from './jsx/auth/auth-context'
import { RequireAuth } from "./jsx/auth/require-auth";
import { GuestOnly } from "./jsx/auth/guest-only";
import PageNotFound from "./jsx/others/404-page-not-found";
import GomokuPage from "./game/gomoku/GomokuPage"

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
					<Route path="/" element={<GuestOnly><Login/></GuestOnly>} />
					<Route path="/game/gomoku" element={<RequireAuth><GomokuPage /></RequireAuth>} />

					{/* SHOULD ALWAYS BE THE LAST ONE */}
					<Route path="*" element={<PageNotFound></PageNotFound>}></Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>
);
