import express from 'express';
import type { Request, Response } from 'express';
import { searchUsers, updateProfilePhoto } from './users.controllers.js';
const router = express.Router();

import { requireAuth, validate } from '../auth/auth.middlewares.js';
import { getMyProfile } from './users.controllers.js';
import { RateLimiter } from '../../common/common-middlewares.ts';
import { searchValidator } from './users.validators.ts';


router.get('/my-profile', requireAuth, getMyProfile);
router.get('/users/search', requireAuth, RateLimiter(1, 20, 'TOO_MANY_REQUESTS'), searchValidator, validate, searchUsers);
router.patch('/my-profile/avatar', requireAuth, updateProfilePhoto);

export default router;
