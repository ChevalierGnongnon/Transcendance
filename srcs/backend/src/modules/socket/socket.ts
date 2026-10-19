import { Server, Socket } from 'socket.io';

import {
  gameAcceptSchema,
  gameCloseSchema,
  gameDeclineSchema,
  gameInvitationStatusSchema,
  gamePendingInvitationSchema,
  gameCancelInvitationSchema,
  gameRequestRematchSchema,
  gameMoveSchema,
  gameStateSchema,
  lastReadSchema,
  messageSchema,
  typingMessageSchema,
} from './schemas.js';
import { onValidated } from './socket.validators.js';
import { requireAuth } from './socket.middlewares.js';
import { handleMessages } from './chat/handleMessages.js';
import { handleMessageRead } from './chat/handleLastReadMessage.js';
import { handleStartChat } from './chat/handleStartChat.js';
import {
  handleGameAccept,
  handleGameClose,
  handleGameDecline,
  handleGameCancelInvitation,
  handleGameGetPendingInvitation,
  handleGameGetState,
  handleGameGetInvitationStatus,
  handleGameMove,
  handleGameRequestRematch,
} from './game/socket-game.js';
import { startTypingMessage, stopTypingMessage } from './chat/handleTypingMessage.ts';
import {
  showConnectedUsers,
  connectUser,
  disconnectUser,
  announceOnline,
  announceOffline,
  filterAndEmit,
} from './user_status/status_management.ts';

export const setupSocketConnection = (io: Server) => {
  io.use(requireAuth);

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);
    if (!socket.userId) throw new Error('Internal server error');
    const userRoom = `user-${socket.userId}`;
    const isFirstConnection = connectUser(socket.userId);
    if (isFirstConnection === true) announceOnline(socket.userId, socket);
    filterAndEmit(socket.userId, socket);

    socket.join(userRoom);

    onValidated(socket, 'new-chat-message', messageSchema, handleMessages);
    onValidated(socket, 'last-read-message', lastReadSchema, handleMessageRead);
    onValidated(socket, 'start-new-chat', startNewChatSchema, handleStartChat);
    onValidated(socket, 'game:accept', gameAcceptSchema, (currentSocket, payload) =>
      handleGameAccept(io, currentSocket, payload)
    );
    onValidated(socket, 'game:decline', gameDeclineSchema, (currentSocket, payload) =>
      handleGameDecline(io, currentSocket, payload)
    );
    onValidated(
      socket,
      'game:get-invitation-status',
      gameInvitationStatusSchema,
      handleGameGetInvitationStatus
    );
    onValidated(
      socket,
      'game:get-pending-invitation',
      gamePendingInvitationSchema,
      handleGameGetPendingInvitation
    );
    onValidated(
      socket,
      'game:cancel-invitation',
      gameCancelInvitationSchema,
      (currentSocket, payload) => handleGameCancelInvitation(io, currentSocket, payload)
    );
    onValidated(socket, 'game:get-state', gameStateSchema, (currentSocket, payload) =>
      handleGameGetState(io, currentSocket, payload)
    );
    onValidated(
      socket,
      'game:request-rematch',
      gameRequestRematchSchema,
      (currentSocket, payload) => handleGameRequestRematch(io, currentSocket, payload)
    );
    onValidated(socket, 'game:move', gameMoveSchema, (currentSocket, payload) =>
      handleGameMove(io, currentSocket, payload)
    );
    onValidated(socket, 'game:close', gameCloseSchema, (currentSocket, payload) =>
      handleGameClose(io, currentSocket, payload)
    );
    onValidated(socket, 'game:leave', gameCloseSchema, (currentSocket, payload) =>
      handleGameClose(io, currentSocket, payload)
    );
    onValidated(socket, 'chat:typing:start', typingMessageSchema, startTypingMessage);
    onValidated(socket, 'chat:typing:stop', typingMessageSchema, stopTypingMessage);

    socket.on('disconnect', (reason) => {
      console.log('User disconnected:', socket.id);
      console.log(`reason: ${reason}`);
      const activeGameId = socket.data.activeGameId as string | undefined;
      if (activeGameId) {
        socket.data.activeGameId = undefined;
        void handleGameClose(io, socket, { gameId: activeGameId }).catch((error) => {
          console.error('Failed to persist game departure after disconnect:', error);
        });
      }
      if (!socket.userId) throw new Error('Internal server error');
      const isLastDeconnection = disconnectUser(socket.userId);
      if (isLastDeconnection === true) announceOffline(socket.userId, socket);
    });
  });
};
