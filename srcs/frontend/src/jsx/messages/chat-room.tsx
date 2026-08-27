import { useState } from "react";
import { useTranslation } from "react-i18next";

import "../../scss/common-classes.scss";
import "../../scss/messages.scss";
import defaultAvatar from "../../../public/default-avatar.png";
import MoreOptions from "./options";
import Message, { MessageProps } from "./Message";

import { socket } from "./socket";

function ChatRoom() {
	const { t } = useTranslation();
	const [showMoreOptions, setShowMoreOptions] = useState(false);

	const [messageText, setMessageText] = useState<string>("");
	const [messages, setMessages] = useState<MessageProps[]>([
		{
			message: "Hello",
			avatar: defaultAvatar,
			sender: "other",
		},
		{ message: "how are you?", sender: "other" },
		{ message: "hello, fine. how are you", sender: "me" },
	]);

	const handleSendMessage = () => {
		// Проверяем, что сообщение не пустое и сокет подключен
		if (messageText.trim() && socket?.connected) {
			// Отправляем сообщение на сервер
			console.log("send message");
			socket.emit("sendMessage", {
				text: messageText.trim(),
				timestamp: new Date().toISOString(),
			});

			if (setMessages) {
				setMessages((prev) => [
					...prev,
					{
						message: messageText.trim(),
						sender: "me",
						avatar: defaultAvatar // нужно добавить автакр текущего
						// timestamp: new Date().toISOString(),
					},
				]);
			}

			setMessageText("");
		}
	};

	return (
		<>
			<div className="chat-list chat-list-right my-2">
				<div className="chat-header">{t("common.chatting-with")}</div>
				<ul className="px-3">
					{messages.map((msg) => (
						<Message
							message={msg.message}
							avatar={msg.avatar}
							sender={msg.sender}
						/>
					))}
				</ul>

				<div className="input-group group-new-message my-3">
					<div className="position-relative">
						<button
							className="btn fs-2 send-message d-flex align-items-center justify-content-center"
							onClick={() => setShowMoreOptions((prev) => !prev)}
						>
							+
						</button>
						{showMoreOptions && <MoreOptions></MoreOptions>}
					</div>

					<textarea
						className="form-control message-area"
						name="new-message"
						placeholder="Type your message here"
						value={messageText}

						onChange={(e) => setMessageText(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSendMessage();
							}
						}}
					></textarea>
					<button className="btn send-message" onClick={handleSendMessage}>
						{t("common.send")}
					</button>
				</div>
			</div>
		</>
	);
}

export default ChatRoom;
