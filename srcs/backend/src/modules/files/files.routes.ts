import express from 'express';
import type { Request, Response } from 'express';
import { uploadImageConfig } from './files.middlewares.ts';
import { requireAuth } from '../auth/auth.middlewares.ts';
import { uploadAvatar } from './files.controllers.js';
const router = express.Router();


import { getDefaultAvatars } from './files.controllers.js';

router.get('/default-avatars', getDefaultAvatars);
router.post('/avatar', requireAuth, uploadImageConfig.single('file'), uploadAvatar);

export default router;
