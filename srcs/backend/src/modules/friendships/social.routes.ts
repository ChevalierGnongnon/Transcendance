import express from 'express';
import type { Request, Response } from 'express';

import { RateLimiter } from '../../common/common-middlewares.js';
import { requireAuth } from '../auth/auth.middlewares.js';
import { validate } from './social.middlewares.js';
import { blockUser, unblockUser } from './blocks.controllers.ts';
import { removeFriendship } from './social.controllers.js';
import {
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriendRequest,
  getSocialState,
  getRelationship,
  getFriends,
} from './social.controllers.js';
import {
  idParamValidator,
  userIdParamValidator,
  friendshipIdParamValidator,
} from './social.validators.js';

const router = express.Router();

router.get('/social/state', requireAuth, getSocialState);
router.get(
  '/social/relationship/:userId',
  requireAuth,
  userIdParamValidator,
  validate,
  getRelationship
);
router.get('/social/friends', requireAuth, getFriends);
// router.delete('/social/friends/:userId', userIdParamValidator, validate);
router.post(
  '/social/friend-requests/:userId',
  requireAuth,
  userIdParamValidator,
  validate,
  sendFriendRequest
);
router.post(
  '/social/friend-requests/:id/accept',
  requireAuth,
  idParamValidator,
  validate,
  acceptFriendRequest
);
router.delete(
  '/social/friend-requests/:id',
  requireAuth,
  idParamValidator,
  validate,
  deleteFriendRequest
);
router.delete(
  '/social/friends/:friendshipId',
  requireAuth,
  friendshipIdParamValidator,
  validate,
  removeFriendship
);
router.post('/social/blocks/:userId', requireAuth, userIdParamValidator, validate, blockUser);
router.delete('/social/blocks/:userId', requireAuth, userIdParamValidator, validate, unblockUser);

export default router;

// sendFriendRequest()
// acceptFriendRequest()
// rejectFriendRequest()
// removeFriend()
// getSocialState()
// getRelationship()
//
// getSocialState()
// getRelationship()
// sendFriendRequest()
// acceptFriendRequest()
// deleteFriendRequest()
// getFriends()
// removeFriend()
// blockUser()
// unblockUser()
//
//
//friendship.service.ts
// createFriendship()
// getFriends()

// isFriend()

// {
//   "isFriend": false,
//   "requestSent": true,
//   "requestReceived": false,
//   "blockedByMe": false,
//   "blockedMe": false
// }
