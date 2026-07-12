import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./login";
import i18n from "../../localisation/i18n.js"
import Header from "./header";
import PersonalPage from "./personal-page.jsx";
import RegisterFlow from "./register-flow.jsx"
import { BrowserRouter, Routes, Route } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<Header/>
			<Routes>
				<Route path="/login" element={<Login/>}/>
				<Route path="/register" element={<RegisterFlow/>}/>
				<Route path="/personalpage" element={<PersonalPage/>}/>
				<Route path="/" element={<RegisterFlow/>} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);