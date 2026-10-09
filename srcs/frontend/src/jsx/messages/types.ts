export type ActiveView = 'chats' | 'new message' | 'block' | 'imaginaryfriend' | 'conversation';
export type MessageType = 'text' | 'invitation' | 'file';
export type MessageStatus = 'sending' | 'sent' | 'read' | 'error';

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
    pseudo?: string;
    profilePhoto: { name: string; id: string };
  };
  content: string;
  type: MessageType;
  createdAt?: string;
  status?: MessageStatus;
}

export interface MessageProps {
  // id: string;
  userId: string;
  content: string;
  profilePhoto: { name: string; id: string };
  senderId: string;
  type: MessageType;
  isRead?: boolean;
  status?: MessageStatus;
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
  mylastReadMessagesId: string | null;
  otherlastReadMessagesId: string | null;
  unreadCount: number;
}

export interface ChatRoomProps {
  me: User;
  chat: IChatPreview;
  setActiveView: (view: ActiveView) => void;
  // messages: Map<string, IMessage[]>;
  messages: IMessage[];
  onAddMessage: (message: IMessage) => void;
  onUpdateMessage: (message: IMessage, status: MessageStatus) => void;
  updateLastReadMessageId: (chatId: string, messageId: string | null) => void;
  otherLastReadMessagesId: string | null;
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
