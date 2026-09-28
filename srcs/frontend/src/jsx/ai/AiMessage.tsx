interface AiMessageProps {
	content: string;
	isUser: boolean;	
}

export const AiMessage = ({ content, isUser}: AiMessageProps) => {
	return (
    <li
      className={`d-flex ${
        isUser ? 'justify-content-end' : 'justify-content-start'
      }`}
    >
      <div
        className={`${
          isUser ? 'message-right' : 'message-left'
        } card p-3 m-2`}
      >
        {content}
      </div>
    </li>
  );
};