import express from 'express';
import type { Request, Response } from 'express';

import { RateLimiter } from '../../common/common-middlewares.js';
import { requireAuth } from '../auth/auth.middlewares.js';
import { validate } from './friendships.middlewares.js';
import {
  idParamValidator,
  friendshipValidator,
  updateFriendshipValidator,
} from './friendships.validators.js';
import {
  createFriendship,
  deleteFriend,
  getFriendships,
  updateFriendships,
} from './friendships.controllers.js';

const router = express.Router();

router.get('/friendships', requireAuth, getFriendships);
router.post('/friendships', requireAuth, friendshipValidator, validate, createFriendship);
router.patch(
  '/friendships/:id',
  requireAuth,
  updateFriendshipValidator,
  validate,
  updateFriendships
);
router.delete('/friendships/:id', requireAuth, idParamValidator, validate, deleteFriend);

export default router;
