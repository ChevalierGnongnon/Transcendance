import express from 'express';

import { attachUserIfPresent, validate} from './auth.middlewares.js';
import { loginValidator, registrationValidator} from './auth.validators.js';
import { login, logout, checkAuth, register} from './auth.controllers.js';
import { uploadImageConfig } from '../files/files.middlewares.ts';
import { RateLimiter } from '@/common/common-middlewares.js';

const router = express.Router();

// 10 trys in 15 minutes, skips successfull requests for counting only bad requests
router.post('/login', RateLimiter(15, 10, 'TOO_MANY_REQUESTS', true), loginValidator, validate, login);
router.post('/logout', logout);
// 20 trys per hour
router.post('/register', RateLimiter(60, 20, 'TOO_MANY_REQUESTS'),  uploadImageConfig.single('avatar'), registrationValidator, validate, register);
router.get('/check-auth', attachUserIfPresent, checkAuth);

export default router;
