import express from 'express';
import type { Request, Response } from 'express';
const router = express.Router();

import { requireAuth } from '../auth/auth.middlewares.js';
import { getMyProfile } from './users.controllers.js';
import { getAllUsers } from './users.controllers.js';
import { getUser } from './users.controllers.js';

// routers.post('/register', );
router.get('/my-profile', requireAuth, getMyProfile);
router.get("/user/:id", requireAuth, getUser);
router.get('/user/:pseudo', requireAuth);
router.get("/users", requireAuth, getAllUsers);
export default router;
