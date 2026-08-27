import { Server, Socket } from 'socket.io';

export const handleMessages = (io: Server, socket: Socket) => {
  socket.on('sendMessage', (data) => {
    console.log('Получено сообщение:', data);
  });
};

// // 1. Слушать новые подключения
// io.on('connection', (socket) => {
//   // ...
// });

// // 2. Отправлять сообщения ВСЕМ подключенным клиентам
// io.emit('global-message', 'Hello everyone!');

// // 3. Отправлять сообщения в комнаты
// io.to('room-1').emit('room-message', 'Hello room!');

// // 4. Получать список всех подключений
// const sockets = io.sockets.sockets;

// // 5. Использовать middleware для всех подключений
// io.use((socket, next) => {
//   // Проверка авторизации для всех сокетов
//   next();
// });

// // 6. Получать статистику
// const count = io.engine.clientsCount; // количество подключений
//
// io.on('connection', (socket) => {
//   // 1. Слушать события от ЭТОГО конкретного клиента
//   socket.on('sendMessage', (data) => {
//     console.log('Получено от клиента:', data);
//   });

//   // 2. Отправлять сообщение ТОЛЬКО ЭТОМУ клиенту
//   socket.emit('private-message', 'Hello only you!');

//   // 3. Присоединиться к комнате
//   socket.join('room-1');

//   // 4. Покинуть комнату
//   socket.leave('room-1');

//   // 5. Отправить сообщение всем, КРОМЕ этого клиента
//   socket.broadcast.emit('user-joined', { id: socket.id });

//   // 6. Получить комнаты, в которых состоит клиент
//   const rooms = socket.rooms;

//   // 7. Отправить сообщение в комнату (от этого клиента)
//   socket.to('room-1').emit('message', 'Hello room from socket!');
// });

// const handleMessages = (io: Server) => {
//   io.emit(ev);
// };

// io.on('connection', (socket) => {
//   console.log('a user connected');
//   socket.on('sendMessage', (data) => {
//     console.log('Получено сообщение:', data);
//   });
// });

// io.on('disconnect', (socket) => {
//   console.log('user disconnected');
// });
