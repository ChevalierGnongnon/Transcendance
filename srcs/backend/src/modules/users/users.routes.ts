import express from 'express';
import type { Request, Response } from 'express';
import { updateProfilePhoto } from './users.controllers.js';
const router = express.Router();

import { requireAuth } from '../auth/auth.middlewares.js';
import { getMyProfile } from './users.controllers.js';

// routers.post('/register', );
router.get('/my-profile', requireAuth, getMyProfile);
router.get('/user/:pseudo"', requireAuth);
router.patch('/my-profile/avatar', requireAuth, updateProfilePhoto);
export default router;
