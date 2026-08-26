import { useState } from "react";
import { useTranslation } from "react-i18next";

import "../../scss/common-classes.scss";
import "../../scss/messages.scss";
import defaultAvatar from "../../../public/default-avatar.png";
import MoreOptions from "./options";

import { socket } from "./socket";

function ChatRoom() {
	const { t } = useTranslation();
	const [showMoreOptions, setShowMoreOptions] = useState(false);

	const [messageText, setMessageText] = useState<string>("");

	// 🔥 Обработчик отправки сообщения
	const handleSendMessage = () => {
		// Проверяем, что сообщение не пустое и сокет подключен
		if (messageText.trim() && socket?.connected) {
			// Отправляем сообщение на сервер
			console.log("send message")
			socket.emit("sendMessage", {
				text: messageText.trim(),
				timestamp: new Date().toISOString(),
			});

			// 🔥 Если хотите сразу добавить сообщение в локальный список
			// if (setMessages) {
			// 	setMessages((prev) => [
			// 		...prev,
			// 		{
			// 			id: Date.now(),
			// 			text: messageText.trim(),
			// 			sender: "me",
			// 			timestamp: new Date().toISOString(),
			// 		},
			// 	]);
			}

			// Очищаем поле ввода
			setMessageText("");
		// }
	};

	return (
		<>
			<div className="chat-list chat-list-right my-2">
				<div className="chat-header">{t("common.chatting-with")}</div>
				<ul className="px-3">
					<li className="d-flex justify-content-start">
						<figure className="avatar-msg">
							<img src={defaultAvatar} alt="avatar" />
						</figure>
						<div className="message-left card p-3 m-2">?</div>
					</li>
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
					></textarea>
					<button className="btn send-message"> {t("common.send")}</button>
				</div>
			</div>
		</>
	);
}

export default ChatRoom;
