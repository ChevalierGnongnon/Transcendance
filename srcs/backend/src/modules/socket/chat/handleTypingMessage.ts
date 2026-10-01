import { Server, Socket } from 'socket.io';
import friendshipsServices from '@/modules/social/friendships.services.js';

export async function startTypingMessage(socket: Socket) {
  socket.on('chat:typing:start', () => {
    console.log('start:typing');

    socket.broadcast.emit('chat:typing:start');
  });
}

export async function stopTypingMessage(socket: Socket) {
  socket.on('chat:typing:stop', () => {
    console.log('stop:typing');
    socket.broadcast.emit('chat:typing:stop');
  });
}
