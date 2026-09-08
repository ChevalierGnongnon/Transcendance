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
  id?: string;
  chatId: string;
  to?: string;
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

// export interface IChat {
//   chatId: string;
//   userId: string;
//   user: {
//     id: string;
//     pseudo: string;
//     profilePhoto: {
//       name: string;
//     };
//   };
//   lastReadMessagesId: string | null;
// }

export interface IChatPreview {
  chatId: string;
  user: {
    id: string;
    pseudo: string;
    profilePhoto: {
      name: string;
    };
  };
  lastReadMessagesId: string | null;
  unreadCount: number;
}

export interface ChatRoomProps {
  me: User;
  chat: IChatPreview;
  setActiveChat: (chat: IChatPreview | null) => void;
  messages: Map<string, IMessage[]>;
  onAddMessage: (message: IMessage) => void;
  onGetMessages: (chatId: string) => Promise<IMessage[]>;
  updateLastReadMessageId: (chatId: string, messageId: string | null) => void;
}

export interface ChatProps {
  chat: IChatPreview;
  setActiveView: (
    view: 'my messages' | 'new message' | 'block' | 'imaginaryfriend' | 'conversation'
  ) => void;
  setActiveChat: (chat: IChatPreview | null) => void;
}

export interface ChatListProps {
  align: 'center' | 'left';
  setActiveView: (
    view: 'my messages' | 'new message' | 'block' | 'imaginaryfriend' | 'conversation'
  ) => void;
  setActiveChat: (chat: IChatPreview | null) => void;
  chatList: IChatPreview[];
  loading: boolean;
  error: Error | null;
}
