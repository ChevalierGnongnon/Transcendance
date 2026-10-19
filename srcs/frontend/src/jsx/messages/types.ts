export type ActiveView = 'chats' | 'new message' | 'imaginaryfriend' | 'conversation';
export type MessageType = 'text' | 'invitation' | 'file';
export type MessageStatus = 'sending' | 'sent' | 'read' | 'error';
export type Relationship = {
  isFriend: false;
  requestSent: false;
  requestReceived: false;
  blockedByMe: false;
  blockedMe: false;
};

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

export interface SearchResult {
  id: string;
  firstName: string;
  lastName: string;
  pseudo: string;
  profilePhoto: {
    id: string;
    name: string;
  };
}

export interface IMessage {
  id: string;
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
  messageId: string;
  chatId: string;
  userId: string;
  content: string;
  profilePhoto: { name: string; id: string };
  senderId: string;
  type: MessageType;
  status: MessageStatus;
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
  // setChatList: (chatList: IChatPreview[]) => void;
  messages: IMessage[];
  onAddMessage: (message: IMessage) => void;
  onUpdateMessage: (message: IMessage, status: MessageStatus) => void;
  otherLastReadMessagesId: string | null;
}

export interface NewChatState {
  user?: SearchResult;
  autoStart?: boolean;
}
