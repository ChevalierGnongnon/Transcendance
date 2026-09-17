import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { prisma } from './lib/prisma.js';
import cron from 'node-cron';

import app from './app.js';
import { fileManager } from './scripts/file-manager.ts';
import { setupSocketConnection } from './modules/socket/socket.ts';

cron.schedule('0 * * * *', fileManager);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  connectionStateRecovery: {},
  cors: {
    // origin: 'https://transcendance.fr',
    credentials: true,
  },
});

setupSocketConnection(io);

const PORT = Number(process.env.EXPRESS_PORT) || 3000;

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
