import { useTranslation } from "react-i18next";
import "../../scss/common-classes.scss";
import "../../scss/messages.scss";
import defaultAvatar from "../../../public/default-avatar.png";
import { socket } from "./socket";

interface MessageListProps {
	align: "center" | "left";
	setActiveView: (
		view:
			| "my messages"
			| "new message"
			| "block"
			| "imaginaryfriend"
			| "conversation",
	) => void;
}

function MessageList({ align, setActiveView }: MessageListProps) {
	const { t } = useTranslation();

	return (
		<div
			className={
				align === "center"
					? "chat-list mx-auto my-2"
					: "chat-list chat-list-side my-2 d-none d-md-block"
			}
		>
			<div className="list-header pt-4">
				<h1>{t("message.my-messages")}</h1>
			</div>
			<ul>
				<li
					className="message-block d-flex"
					onClick={() => setActiveView("conversation")}
				>
					<figure className="avatar-msg">
						<img src={defaultAvatar} alt="avatar" />
					</figure>
					<div className="p-2 message-text">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum ab
						voluptate incidunt.
					</div>
				</li>
				<li
					className="message-block d-flex"
					onClick={() => setActiveView("conversation")}
				>
					<figure className="avatar-msg">
						<img src={defaultAvatar} alt="avatar" />
					</figure>
					<div className="p-2 message-text">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
						obcaecati ullam labore beatae illo,
					</div>
				</li>
				<li
					className="message-block d-flex"
					onClick={() => setActiveView("conversation")}
				>
					<figure className="avatar-msg">
						<img src={defaultAvatar} alt="avatar" />
					</figure>
					<div className="p-2 message-text">
						Lorem, ipsum dolor sit amet consectetur adipisicing elit.
						Accusantium qui labore voluptas quibusdam volupta!
					</div>
				</li>
				<li
					className="message-block d-flex"
					onClick={() => setActiveView("conversation")}
				>
					<figure className="avatar-msg">
						<img src={defaultAvatar} alt="avatar" />
					</figure>
					<div className="p-2 message-text">
						Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione
						voluptatibus veritatis suscipit esse laudantium voluptatem,
					</div>
				</li>
				<li
					className="message-block d-flex"
					onClick={() => setActiveView("conversation")}
				>
					<figure className="avatar-msg">
						<img src={defaultAvatar} alt="avatar" />
					</figure>
					<div className="p-2 message-text">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni
						blanditiis cumque explicabo nobis dignissimos non?
					</div>
				</li>
				<li
					className="message-block d-flex"
					onClick={() => setActiveView("conversation")}
				>
					<figure className="avatar-msg">
						<img src={defaultAvatar} alt="avatar" />
					</figure>
					<div className="p-2 message-text">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum ab
						voluptate incidunt.
					</div>
				</li>
				<li
					className="message-block d-flex"
					onClick={() => setActiveView("conversation")}
				>
					<figure className="avatar-msg">
						<img src={defaultAvatar} alt="avatar" />
					</figure>
					<div className="p-2 message-text">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
						obcaecati ullam labore beatae illo,
					</div>
				</li>
				<li
					className="message-block d-flex"
					onClick={() => setActiveView("conversation")}
				>
					<figure className="avatar-msg">
						<img src={defaultAvatar} alt="avatar" />
					</figure>
					<div className="p-2 message-text">
						Lorem, ipsum dolor sit amet consectetur adipisicing elit.
						Accusantium qui labore voluptas quibusdam volupta!
					</div>
				</li>
				<li
					className="message-block d-flex"
					onClick={() => setActiveView("conversation")}
				>
					<figure className="avatar-msg">
						<img src={defaultAvatar} alt="avatar" />
					</figure>
					<div className="p-2 message-text">
						Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione
						voluptatibus veritatis suscipit esse laudantium voluptatem,
					</div>
				</li>
				<li
					className="message-block d-flex"
					onClick={() => setActiveView("conversation")}
				>
					<figure className="avatar-msg">
						<img src={defaultAvatar} alt="avatar" />
					</figure>
					<div className="p-2 message-text">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni
						blanditiis cumque explicabo nobis dignissimos non?
					</div>
				</li>
				<li
					className="message-block d-flex"
					onClick={() => setActiveView("conversation")}
				>
					<figure className="avatar-msg">
						<img src={defaultAvatar} alt="avatar" />
					</figure>
					<div className="p-2 message-text">
						Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione
						voluptatibus veritatis suscipit esse laudantium voluptatem,
					</div>
				</li>
				<li
					className="message-block d-flex"
					onClick={() => setActiveView("conversation")}
				>
					<figure className="avatar-msg">
						<img src={defaultAvatar} alt="avatar" />
					</figure>
					<div className="p-2 message-text">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni
						blanditiis cumque explicabo nobis dignissimos non?
					</div>
				</li>
			</ul>
		</div>
	);
}

export default MessageList;
