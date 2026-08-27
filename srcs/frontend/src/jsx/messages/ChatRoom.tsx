interface ChatRoomProps {
	avatar?: string;
	name?: number;
}

const ChatRoom = ({ avatar, name }: ChatRoomProps) => {
	const { t } = useTranslation();
	const [showMoreOptions, setShowMoreOptions] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);


	// 🔥 Создаем дочерние компоненты в зависимости от количества чатов
	const renderChatRooms = () => {
		// Если есть чаты - рендерим все
		if (chatRooms.length > 0) {
			return chatRooms.map((room) => (
				<ChatRoomItem key={room.id} room={room} socket={socket} />
			));
		}

		// Или один чат по умолчанию
		return <ChatRoomItem roomId={roomId || "default"} socket={socket} />;
	};

	return (
		<div className="chat-list chat-list-right my-2">
			<div className="chat-header">
				{t("common.chatting-with")}{" "}
				{chatRooms.length > 0 && `(${chatRooms.length} чатов)`}
			</div>

			{/* Рендерим все чаты */}
			{renderChatRooms()}
		</div>
	);
};
