import { Server, Socket } from 'socket.io';

import {
  gameAcceptSchema,
  gameMoveSchema,
  gameStateSchema,
  lastReadSchema,
  messageSchema,
  startNewChatSchema,
} from './schemas.js';
import { onValidated } from './socket.validators.js';
import { requireAuth } from './socket.middlewares.js';
import { handleMessages } from './chat/handleMessages.js';
import { handleMessageRead } from './chat/handleLastReadMessage.js';
import { handleStartChat } from './chat/handleStartChat.js';
import {
  handleGameAccept,
  handleGameGetState,
  handleGameMove,
  handleGameRestart,
} from './game/socket-game.js';

export const setupSocketConnection = (io: Server) => {

  console.log("setupSocketConnection called");

  io.use(requireAuth);

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    const userRoom = `user-${socket.userId}`;
    socket.join(userRoom);

    onValidated(socket, 'new-chat-message', messageSchema, handleMessages);
    onValidated(socket, 'last-read-message', lastReadSchema, handleMessageRead);
    onValidated(socket, 'start-new-chat', startNewChatSchema, handleStartChat);
    onValidated(socket, 'game:accept', gameAcceptSchema, (currentSocket, payload) =>
      handleGameAccept(io, currentSocket, payload)
    );
    onValidated(socket, 'game:get-state', gameStateSchema, handleGameGetState);
    onValidated(socket, 'game:new-round', gameStateSchema, (currentSocket, payload) =>
      handleGameRestart(io, currentSocket, payload)
    );
    onValidated(socket, 'game:move', gameMoveSchema, (currentSocket, payload) =>
      handleGameMove(io, currentSocket, payload)
    );

    socket.on('disconnect', (reason) => {
      console.log('User disconnected:', socket.id);
      console.log(`reason: ${reason}`);
    });
  });
};
