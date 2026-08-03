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

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<AppHeader/>
			<Routes>
				<Route path="/login" element={<Login/>}/>
				<Route path="/register" element={<RegisterFlow/>}/>
				<Route path="/personalpage" element={<PersonalPage/>}/>
				<Route path="/parameters" element={<Parameters/>}/>
				<Route path="/" element={<RegisterFlow/>} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);