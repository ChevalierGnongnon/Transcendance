import express from 'express';
import type { Request, Response } from 'express';
import { uploadImageConfig } from './files.middlewares.ts';
import { attachUserIfPresent, requireAuth } from '../auth/auth.middlewares.ts';
import { downloadFile, uploadAvatar } from './files.controllers.js';
import { deleteFile } from './files.controllers.js';

const router = express.Router();


import { getDefaultAvatars } from './files.controllers.js';

router.get('/default-avatars', getDefaultAvatars);
router.get('/:id/download', attachUserIfPresent, downloadFile)

router.post('/avatar', requireAuth, uploadImageConfig.single('file'), uploadAvatar);

router.delete('/:id', requireAuth, deleteFile); 

export default router;
