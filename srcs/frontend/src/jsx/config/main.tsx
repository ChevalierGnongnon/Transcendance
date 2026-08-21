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
import Messages from "../account/messages-page"


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
					<Route path="/" element={<GuestOnly><Login/></GuestOnly>} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>
);
