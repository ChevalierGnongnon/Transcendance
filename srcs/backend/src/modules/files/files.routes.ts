import express from 'express';

import { attachUserIfPresent, requireAuth } from '../auth/auth.middlewares.js';
import { deleteFile, uploadMessageFile, downloadFile, uploadAvatar, getDefaultAvatars} from './files.controllers.js';
import { uploadAttachmentConfig, uploadImageConfig} from './files.middlewares.ts';
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
