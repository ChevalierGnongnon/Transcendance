import express from 'express';
import type { Request, Response } from 'express';

import { RateLimiter } from '../../common/common-middlewares.js';
import { requireAuth } from '../auth/auth.middlewares.js';
import { validate } from './friendships.middlewares.js';
import { userIdParamValidator } from './bocks.validators.ts';
import { blockUser, unblockUser } from './blocks.controllers.ts';
import { sendFriendRequest, getSocialState } from './social.controllers.js';
import { idParamValidator } from './friendships.validators.ts';

const router = express.Router();

router.post(
  '/social/friend-requests/:userId',
  requireAuth,
  userIdParamValidator,
  validate,
  sendFriendRequest
);
router.post('/social/friend-requests/:id/accept');
router.delete('/social/friend-requests/:id', idParamValidator);
router.get('/social/friends');
router.delete('/social/friends/:userId', userIdParamValidator, validate);
router.post('/social/blocks/:userId', userIdParamValidator, validate);
router.delete('/social/blocks/:userId', userIdParamValidator, validate);

router.post('/social/blocks/:userId', requireAuth, userIdParamValidator, validate, blockUser);
router.delete('/social/blocks/:userId', userIdParamValidator, validate, unblockUser);

router.get('/social/state', requireAuth, getSocialState);
router.get('/social/relationship/:userId', userIdParamValidator, validate);

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
// removeFriendship()
// isFriend()
