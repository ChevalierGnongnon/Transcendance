import app from './app.js';
import { prisma } from './lib/prisma.js';

const PORT = Number(process.env.EXPRESS_PORT) || 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
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
