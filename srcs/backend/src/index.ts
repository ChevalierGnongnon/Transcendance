import { createServer } from 'node:http';
import { Server } from 'socket.io';

import app from './app.js';
import { prisma } from './lib/prisma.js';

const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = Number(process.env.EXPRESS_PORT) || 3000;

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('sendMessage', (data) => {
    console.log('Получено сообщение:', data);
  });
});

const server = httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Express server started on port ${PORT}`);
});

const shutdown = async (signal: string) => {
  console.log(`${signal} received. Shutting down...`);

  server.close(async (serverError) => {
    if (serverError) {
      console.error('Failed to close HTTP server:', serverError);
      process.exit(1);
    }

    try {
      await prisma.$disconnect();

      console.log('Database connection closed');
      console.log('HTTP server stopped');

      process.exit(0);
    } catch (error) {
      console.error('Failed to disconnect Prisma:', error);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  shutdown('SIGINT');
});
