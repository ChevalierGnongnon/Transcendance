import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

import "../../scss/common-classes.scss";
import "../../scss/messages.scss";

import MoreOptions from "./options";
import { Message } from "./Message";
import GameInviteMessage from "./GameInviteMessage";
import { socket } from "./socket";

import type { IMessage, ChatRoomProps } from "./types.js";

function ChatRoom(roomProps: ChatRoomProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const me = roomProps.me;
  const chatId = roomProps.chat.chatId;
  const messages = chatId ? roomProps.messages.get(chatId) ?? [] : [];

  const [messageText, setMessageText] = useState("");
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Auto-scroll
  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
    },
    []
  );

  const checkIfAtBottom = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setIsAtBottom(scrollHeight - scrollTop <= clientHeight + 10);
  }, []);

  const handleScroll = useCallback(() => checkIfAtBottom(), [checkIfAtBottom]);

  useEffect(() => {
    if (isAtBottom) scrollToBottom("smooth");
  }, [messages, isAtBottom, scrollToBottom]);

  // Join chat room
  useEffect(() => {
    socket.emit("join-chat-request", { chatId, userId: me.id });

    return () => {
      socket.emit("leave-chat-request", { chatId });
    };
  }, [chatId]);

  // Send text message
  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const msg: IMessage = {
      chatId,
      recipientId: roomProps.chat.user.id,
      sender: { id: me.id, profilePhoto: { name: me.profilePhoto.name } },
      type: "text",
      content: messageText
    };

    socket.emit("new-chat-message", msg);
    roomProps.onAddMessage(msg);
    setMessageText("");
  };

  // Handle incoming game invites
  useEffect(() => {
    const handleInvite = (invite) => {
      roomProps.onAddMessage({
        id: Date.now(),
        chatId,
        sender: { id: invite.fromUserId, profilePhoto: { name: invite.fromUserPhoto } },
        type: "game_invite",
        content: invite
      });
    };

    socket.on("game:invite", handleInvite);
    return () => socket.off("game:invite", handleInvite);
  }, [chatId]);

  // Handle invite acceptance → redirect to game
  useEffect(() => {
    const handleAccepted = ({ gameId, invite }) => {
      const opponentId =
        invite.fromUserId === me.id ? invite.toUserId : invite.fromUserId;

      navigate("/game", {
        state: {
          me,
          opponentId,
          boardSize: invite.boardSize,
          mode: invite.mode,
          gameId
        }
      });
    };

    socket.on("game:accepted", handleAccepted);
    return () => socket.off("game:accepted", handleAccepted);
  }, [navigate, me]);

  // Handle invite decline → system message
  useEffect(() => {
    const handleDeclined = ({ invite }) => {
      roomProps.onAddMessage({
        id: Date.now(),
        chatId,
        type: "system",
        sender: { id: 0, profilePhoto: { name: "system.png" } },
        content: `${invite.toUserName} declined the game invite.`
      });
    };

    socket.on("game:decline", handleDeclined);
    return () => socket.off("game:decline", handleDeclined);
  }, [chatId]);

  // If StartGame redirected here with invite → send it
  useEffect(() => {
    if (location.state?.invite) {
      const invite = {
        ...location.state.invite,
        chatId,
        fromUserName: me.pseudo,
        toUserName: roomProps.chat.user.pseudo,
        fromUserPhoto: me.profilePhoto.name
      };

      socket.emit("game:invite", invite);
    }
  }, [location.state]);

  return (
    <>
      <div className="chat-list chat-list-right my-2">
        <div className="chat-header fs-1">
          {/*{t('common.chatting-with')} {`${roomProps.chat.pseudo}`}*/}
          {roomProps.chat.user.pseudo}
        </div>
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="chat-messages-container"
          style={{
            maxHeight: '65vh',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          (
          <ul className="px-3">
            {messages.map((msg, index) => (
              <Message
                key={index}
                userId={me.id}
                profilePhoto={msg.sender.profilePhoto}
                senderId={msg.sender.id}
                content={msg.content}
                type={"invitation"}
              />
            ))}
          </ul>
          )
          <div ref={messagesEndRef} style={{ height: '2px' }} />
        </div>
        <div className="input-group group-new-message my-3 mt-auto">
          <div className="position-relative">
            <button
              className="btn fs-2 send-message d-flex align-items-center justify-content-center"
              onClick={() => setShowMoreOptions((prev) => !prev)}
            >
              +
            </button>
            {showMoreOptions && (
            <MoreOptions
              opponentId={roomProps.chat.user.id}
              chatId={roomProps.chat.chatId}
              navigate={navigate}
            />
          )}
          </div>

          <textarea
            className="form-control message-area"
            name="new-message"
            placeholder="Type your message here"
            value={messageText}

            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          ></textarea>
          <button className="btn send-message" onClick={handleSendMessage}>
            {t('common.send')}
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatRoom;


// import { useState, useEffect, useRef, useCallback } from 'react';
// import { useTranslation } from 'react-i18next';

// import '../../scss/common-classes.scss';
// import '../../scss/messages.scss';
// import MoreOptions from './options';
// import { Message } from './Message';
// import { socket } from './socket';
// import type { User, IMessage, ChatRoomProps } from './types.js';
// import { fetchMessages } from './utils/api.js';

// function ChatRoom(roomProps: ChatRoomProps) {
//   const { t } = useTranslation();
//   const [showMoreOptions, setShowMoreOptions] = useState(false);

//   const [messageText, setMessageText] = useState<string>('');
//   // const [messages, setMessages] = useState<IMessage[]>([]);
//   const [loading, setLoading] = useState(false);
//   // const [error, setError] = useState<Error | null>(null);
//   const me = roomProps.me;
//   const chatId = roomProps.chat.chatId;
//   const messages = chatId ? (roomProps.messages.get(chatId) ?? []) : [];

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isAtBottom, setIsAtBottom] = useState(true);

//   const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
//     messagesEndRef.current?.scrollIntoView({
//       behavior,
//       block: 'end',
//     });
//   }, []);

//   const checkIfAtBottom = useCallback(() => {
//     if (!containerRef.current) return;

//     const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
//     const atBottom = scrollHeight - scrollTop <= clientHeight + 10; // +10 для погрешности
//     setIsAtBottom(atBottom);
//   }, []);

//   const handleScroll = useCallback(() => {
//     checkIfAtBottom();
//   }, [checkIfAtBottom]);

//   // scroll if changed chat
//   // useEffect(() => {
//   //   if (roomProps.chat?.chatId) {
//   //     setTimeout(() => {
//   //       scrollToBottom('auto');
//   //     }, 100);
//   //   }
//   // }, [roomProps.chat?.chatId, scrollToBottom]);

//   // scroll if new message
//   useEffect(() => {
//     if (isAtBottom) {
//       scrollToBottom('smooth');
//     }
//   }, [messages, isAtBottom, scrollToBottom]);

//   useEffect(() => {
//     if (messages.length > 0) {
//       const lastMessageId = messages[messages.length - 1].id ?? null;
//       roomProps.updateLastReadMessageId(roomProps.chat.chatId, lastMessageId);
//     }
//     scrollToBottom();
//   }, [roomProps.chat?.chatId, roomProps.messages]);

//   useEffect(() => {
//     const handleChatJoined = (answer: { chatId: string; userId: string }) => {};

//     // send request to join chat
//     socket.emit('join-chat-request', { chatId: roomProps.chat.chatId, userId: me.id });
//     // socket.on('chat-room-joined', handleChatJoined);

//     // if dont have errors
//     // if (isAtBottom) {
//     //   roomProps.chat.unreadCount = '0';
//     //   roomProps.setActiveChat({ ...roomProps.chat });
//     // }

//     // scrollToBottom();
//     // send put to update last_read_chats_id
//     return () => {
//       console.log('Cleanup: removing handler for chatId', roomProps.chat.chatId);
//       socket.off('chat-room-joined', handleChatJoined); // ←  Remove joind ...
//       socket.emit('leave-chat-request', { chatId: roomProps.chat.chatId });
//     };
//   }, [roomProps.chat.chatId]);

//   const handleSendMessage = () => {
//     if (messageText.trim() && socket?.connected) {
//       const messageToSend: IMessage = {
//         chatId: roomProps.chat.chatId,
//         recipientId: roomProps.chat.user.id,
//         sender: { id: me.id, profilePhoto: { name: me.profilePhoto.name } },
//         content: messageText,
//       };
//       socket.emit('new-chat-message', messageToSend);

//       // setMessages((prev) => [...prev, messageToSend]);
//       roomProps.onAddMessage(messageToSend);
//       // scrollToBottom();
//       setMessageText('');
//     }
//   };

//   if (!messages) {
//     return <div className="chat-placeholder">Open chat</div>;
//   }

//   return (
//     <>
//       <div className="chat-list chat-list-right my-2">
//         <div className="chat-header fs-1">
//           {/*{t('common.chatting-with')} {`${roomProps.chat.pseudo}`}*/}
//           {roomProps.chat.user.pseudo}
//         </div>
//         <div
//           ref={containerRef}
//           onScroll={handleScroll}
//           className="chat-messages-container"
//           style={{
//             maxHeight: '65vh',
//             overflowY: 'auto',
//             position: 'relative',
//           }}
//         >
//           (
//           <ul className="px-3">
//             {messages.map((msg, index) => (
//               <Message
//                 key={index}
//                 userId={me.id}
//                 profilePhoto={msg.sender.profilePhoto.name}
//                 senderId={msg.sender.id}
//                 content={msg.content}
//               />
//             ))}
//           </ul>
//           )
//           <div ref={messagesEndRef} style={{ height: '2px' }} />
//         </div>
//         <div className="input-group group-new-message my-3 mt-auto">
//           <div className="position-relative">
//             <button
//               className="btn fs-2 send-message d-flex align-items-center justify-content-center"
//               onClick={() => setShowMoreOptions((prev) => !prev)}
//             >
//               +
//             </button>
//             {showMoreOptions && <MoreOptions></MoreOptions>}
//           </div>

//           <textarea
//             className="form-control message-area"
//             name="new-message"
//             placeholder="Type your message here"
//             value={messageText}

//             onChange={(e) => setMessageText(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter' && !e.shiftKey) {
//                 e.preventDefault();
//                 handleSendMessage();
//               }
//             }}
//           ></textarea>
//           <button className="btn send-message" onClick={handleSendMessage}>
//             {t('common.send')}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

// export default ChatRoom;
