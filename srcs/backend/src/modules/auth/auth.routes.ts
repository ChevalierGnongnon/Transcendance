import express from 'express';
import type { Request, Response } from 'express';

import { requireAuth, validate} from './auth.middlewares.js';
import { loginValidator, registerValidator, completeProfileValidator } from './auth.validators.js';
import { login, logout, checkAuth, register, completeProfile } from './auth.controllers.js';

const router = express.Router();

router.post('/login', loginValidator, validate, login);
router.post('/logout', logout);
router.post('/register', registerValidator, validate, register);
router.post('/complete-profile', completeProfileValidator, validate, completeProfile);
router.get('/check-auth', requireAuth, checkAuth);
export default router;
