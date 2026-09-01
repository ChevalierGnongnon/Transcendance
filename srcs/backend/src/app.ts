import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';

import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import filesRoutes from './modules/files/files.routes.js';
import chatRoutes from './modules/chat/chat.routes.js';
import healthRouter from './modules/health.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: 'https://transcendance.fr' }));
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoutes);
app.use('/api', usersRoutes);
app.use('/api', filesRoutes);
app.use('/api', healthRouter);
app.use('/api', chatRoutes);

export default app;
