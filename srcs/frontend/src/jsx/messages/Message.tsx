import defaultAvatar from "../../../public/default-avatar.png"; // TMP

interface MessageProps {
	message: string;
	avatar?: string;
	sender?: "me" | "other";
}

const Message = ({ message, avatar = defaultAvatar, sender }: MessageProps) => {
	return (
		<>
			<li
				className={`d-flex ${sender === "me" ? "justify-content-end" : "justify-content-start"}`}
			>
				<figure className="avatar-msg">
					<img src={avatar} alt="avatar" />
				</figure>
				<div
					className={`${sender === "me" ? "message-right" : "message-left"} card p-3 m-2`}
				>
					{message}
				</div>
			</li>
		</>
	);
};

export default Message;
export type { MessageProps };
