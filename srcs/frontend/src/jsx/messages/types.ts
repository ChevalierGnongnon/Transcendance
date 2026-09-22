export type ActiveView = 'chats' | 'new message' | 'block' | 'imaginaryfriend' | 'conversation';

export type MessageType = 'text' | 'invitation' | 'file';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  pseudo: string;
  profilePhoto: {
    name: string;
    id: string;
  };
}

export interface IMessage {
  id?: string;
  chatId: string;
  recipientId?: string;
  sender: {
    id: string;
    profilePhoto: { name: string; id: string };
  };
  content: string;
  type: MessageType;
  createdAt?: string;
}

export interface MessageProps {
  userId: string;
  content: string;
  profilePhoto: { name: string; id: string };
  senderId: string;
  type: MessageType;
}

export interface IChatPreview {
  chatId: string;
  user: {
    id: string;
    pseudo: string;
    profilePhoto: {
      name: string;
      id: string;
    };
  };
  lastReadMessagesId: string | null;
  unreadCount: number;
}

export interface ChatRoomProps {
  me: User;
  chat: IChatPreview;
  setActiveChat: (chat: IChatPreview | null) => void;
  setActiveView: (view: ActiveView) => void;
  messages: Map<string, IMessage[]>;
  onAddMessage: (message: IMessage) => void;
  updateLastReadMessageId: (chatId: string, messageId: string | null) => void;
}

export interface ChatProps {
  chat: IChatPreview;
  setActiveView: (view: ActiveView) => void;
  setActiveChat: (chat: IChatPreview | null) => void;
}

export interface ChatListProps {
  align: 'center' | 'left';
  setActiveView: (view: ActiveView) => void;
  setActiveChat: (chat: IChatPreview | null) => void;
  chatList: IChatPreview[];
  loading: boolean;
  error: Error | null;
}
