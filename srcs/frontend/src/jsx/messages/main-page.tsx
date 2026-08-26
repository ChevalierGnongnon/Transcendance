import "../../scss/common-classes.scss";
import "../../scss/messages.scss";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import ChatRoom from "./chat-room";
import NavBar from "./navbar";
import NewChat from "./new-chat";
import MoreOptions from "./options";
import Block from "./block";
import MessageList from "./list-messages";
import { socket } from "./socket.js";

// import { io } from "socket.io-client";

function Messages() {
	const [activeView, setActiveView] = useState<
		"my messages" | "new message" | "block" | "imaginaryfriend" | "conversation"
	>("my messages");

	const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
	const [fooEvents, setFooEvents] = useState<any[]>([]);

	useEffect(() => {
		if (!socket.connected) {
			socket.connect();
			console.log("🔄 Attempting to connect...");
		}
		function onConnect() {
			setIsConnected(true);
			console.log("✅ Socket is connected");
		}

		function onDisconnect() {
			setIsConnected(false);
			console.log("❌ Socket disconnected");
		}

		function onFooEvent(value: any) {
			setFooEvents((previous) => [...previous, value]);
		}

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("foo", onFooEvent);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("foo", onFooEvent);
		};
	}, []);

	return (
		<>
			<NavBar activeView={activeView} setActiveView={setActiveView}></NavBar>
			<div className="socket-status">
				Status: {isConnected ? "🟢 Connected" : "🔴 Disconnect"}
			</div>
			<div className={activeView !== "my messages" ? "d-flex" : ""}>
				<MessageList
					align={activeView === "my messages" ? "center" : "left"}
					setActiveView={setActiveView}
				/>
				{activeView === "conversation" && <ChatRoom />}
				{activeView === "new message" && <NewChat />}
				{activeView === "block" && <Block />}
				{activeView === "imaginaryfriend" && <MoreOptions />}
			</div>
		</>
	);
}

export default Messages;
