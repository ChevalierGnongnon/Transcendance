import express from 'express';
import { requireAuth, validate } from '../auth/auth.middlewares.js';
import { getMyProfile } from './users.controllers.js';
import { getAllUsers } from './users.controllers.js';
import { getUser } from './users.controllers.js';

import { RateLimiter } from '../../common/common-middlewares.ts';
import { updateUser } from './users.controllers.ts';
import { updateValidator,  avatarUpdateValidator, searchValidator } from './users.validators.ts';
import {
    getUserByPseudo,
    searchUsers,
    updateProfilePhoto,
    getMyActiveGame, 
} from './users.controllers.js';



const router = express.Router();

router.get('/my-profile', requireAuth, getMyProfile);
router.get('/my-active-game', requireAuth, getMyActiveGame);
router.get("/user/:id", requireAuth, getUser);
router.get("/users", requireAuth, getAllUsers);
router.get('/users/search', requireAuth, RateLimiter(1, 20, 'TOO_MANY_REQUESTS'), searchValidator, validate, searchUsers);
router.get('/users/:pseudo', requireAuth, RateLimiter(1, 60, 'TOO_MANY_REQUESTS'), getUserByPseudo);
router.patch('/my-profile/avatar', requireAuth, avatarUpdateValidator, validate, updateProfilePhoto);
router.patch('/my-profile', requireAuth, updateValidator, validate, updateUser);

export default router;
