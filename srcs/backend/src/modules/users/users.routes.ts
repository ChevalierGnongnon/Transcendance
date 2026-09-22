import express from 'express';
import type { Request, Response } from 'express';
import { getUserByPseudo, searchUsers, updateProfilePhoto } from './users.controllers.js';

import { requireAuth, validate } from '../auth/auth.middlewares.js';
import { getMyProfile } from './users.controllers.js';
import { getAllUsers } from './users.controllers.js';
import { getUser } from './users.controllers.js';

import { RateLimiter } from '../../common/common-middlewares.ts';
import { searchValidator } from './users.validators.ts';
import { updateUser } from './users.controllers.ts';
import { updateValidator } from './users.validators.ts';
const router = express.Router();

router.get('/my-profile', requireAuth, getMyProfile);
router.get("/user/:id", requireAuth, getUser);
// router.get('/user/:pseudo', requireAuth);
router.get("/users", requireAuth, getAllUsers);
router.get('/users/search', requireAuth, RateLimiter(1, 20, 'TOO_MANY_REQUESTS'), searchValidator, validate, searchUsers);
router.get('/users/:pseudo', requireAuth, RateLimiter(1, 20, 'TOO_MANY_REQUESTS'), getUserByPseudo);
router.patch('/my-profile/avatar', requireAuth, updateProfilePhoto);
router.patch('/my-profile', requireAuth, updateValidator, validate, updateUser);

export default router;
