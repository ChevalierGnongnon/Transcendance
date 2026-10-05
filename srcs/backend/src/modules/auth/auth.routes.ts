import express from 'express';
import type { Request, Response } from 'express';

import { requireAuth, validate} from './auth.middlewares.js';
import { loginValidator, registrationValidator} from './auth.validators.js';
import { login, logout, checkAuth, register} from './auth.controllers.js';
import { uploadImageConfig } from '../files/files.middlewares.ts';
import { RateLimiter } from '@/common/common-middlewares.js';

const router = express.Router();

router.post('/login', RateLimiter(15, 10, 'TOO_MANY_REQUESTS'), loginValidator, validate, login);
router.post('/logout', logout);
router.post('/register', RateLimiter(60, 5, 'TOO_MANY_REQUESTS'),  uploadImageConfig.single('avatar'), registrationValidator, validate, register);
router.get('/check-auth', requireAuth, checkAuth);
export default router;
