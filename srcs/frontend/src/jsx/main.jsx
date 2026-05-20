import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./login";
import i18n from "../../localisation/i18n.js"
import Header from "./header";


ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Header />
		<Login />
	</React.StrictMode>
);