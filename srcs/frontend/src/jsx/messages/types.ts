type ActiveView = 'my messages' | 'new message' | 'block' | 'imaginaryfriend' | 'conversation';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  pseudo: string;
  profilePhoto: {
    name: string;
  };
}

export interface IMessage {
  chatId: string;
  sender: {
    id: string;
    profilePhoto: { name: string };
  };
  content: string;
  createdAt?: string;
}

export interface MessageProps {
  userId: string;
  content: string;
  profilePhoto: string;
  senderId: string;
}

export interface IChat {
  chat_id: string;
  user_id: string;
  pseudo: string;
  profilePhoto: string;
}

export interface IChatPreview {
  chatId: string;
  pseudo: string;
  profilePhoto: string;
}

export interface ChatRoomProps {
  me: User;
  chatId: string;
}

export interface ChatProps {
  chatId: string;
  pseudo: string;
  profilePhoto: string;
  setActiveView: (
    view: 'my messages' | 'new message' | 'block' | 'imaginaryfriend' | 'conversation'
  ) => void;
  setActiveChatId: (chatId: string | null) => void;
}

export interface ChatListProps {
  align: 'center' | 'left';
  setActiveView: (
    view: 'my messages' | 'new message' | 'block' | 'imaginaryfriend' | 'conversation'
  ) => void;
  setActiveChatId: (chatId: string | null) => void;
}
