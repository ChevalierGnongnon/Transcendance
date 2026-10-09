import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';

import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import filesRoutes from './modules/files/files.routes.js';
import chatRoutes from './modules/chat/chat.routes.js';
import socialRoutes from './modules/social/social.routes.ts';
import healthRouter from './modules/health.js';
import { multerErrorManager } from './modules/files/files.middlewares.ts';
import { notFoundCall } from './common/common-middlewares.ts';

const app = express();

// all requests go through nginx before express, so express sees nginx ip for everyone.
// rate-limiter counts per IP, it would consider every user as a single person, 20 search requests 
// would hit the limit and block everyone.
// this tells express there is 1 proxy in front: trust the X-Forwarded-For header to get the real IP.
app.set('trust proxy', 1);


app.use(helmet());
app.use(cors({ origin: 'https://transcendance.fr' }));
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoutes);
app.use('/api', usersRoutes);
app.use('/api', filesRoutes);
app.use('/api', healthRouter);
app.use('/api', chatRoutes);
app.use('/api', socialRoutes);
app.use(notFoundCall);
app.use(multerErrorManager)

export default app;
 