import express from 'express';
import type { Request, Response } from 'express';

import { uploadImageConfig } from './files.middlewares.js';
import { attachUserIfPresent, requireAuth } from '../auth/auth.middlewares.js';
import { downloadFile, uploadAvatar } from './files.controllers.js';
import { deleteFile } from './files.controllers.js';
import { uploadMessageFile } from './files.controllers.js';
import { uploadAttachmentConfig } from './files.middlewares.ts';
import { getDefaultAvatars } from './files.controllers.js';
import { validateChatIdUuid } from './files.validators.js';
import { validate } from '@/common/common-middlewares.js';

const router = express.Router();

router.get('/default-avatars', getDefaultAvatars);
router.get('/:id/download', attachUserIfPresent, downloadFile);

router.post('/avatar', requireAuth, uploadImageConfig.single('file'), uploadAvatar);
router.post(
  '/message/:chatId',
  requireAuth,
  validateChatIdUuid,
  validate,
  uploadAttachmentConfig.single('file'),
  uploadMessageFile
);

router.delete('/:id', requireAuth, deleteFile);

export default router;
