import express from 'express';

import { attachUserIfPresent, requireAuth } from '../auth/auth.middlewares.js';
import { deleteFile, uploadMessageFile, downloadFile, uploadAvatar, getDefaultAvatars} from './files.controllers.js';
import { uploadAttachmentConfig, uploadImageConfig} from './files.middlewares.ts';
import { validateChatIdUuid } from './files.validators.js';
import { validate, RateLimiter } from '@/common/common-middlewares.js';

const router = express.Router();

router.get('/default-avatars', getDefaultAvatars);
router.get('/:id/download', attachUserIfPresent, downloadFile);

router.post('/avatar', requireAuth, RateLimiter(15, 10, 'TOO_MANY_REQUESTS'), uploadImageConfig.single('file'), uploadAvatar);
router.post(
  '/message/:chatId',
  requireAuth,
  RateLimiter(10, 30, 'TOO_MANY_REQUESTS'),
  validateChatIdUuid,
  validate,
  uploadAttachmentConfig.single('file'),
  uploadMessageFile
);

router.delete('/:id', requireAuth, deleteFile);

export default router;
