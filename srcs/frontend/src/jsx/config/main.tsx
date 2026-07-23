import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "../register-and-login/login";
import Header from "../headers/header-offline";
import PersonalPage from "../account/personal-page";
import RegisterFlow from "../register-and-login/register-flow";
import Parameters from '../account/parameters';
import PersonalHeader from '../headers/header-online';
import { BrowserRouter, Routes, Route } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Header/>
			<PersonalHeader/>
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