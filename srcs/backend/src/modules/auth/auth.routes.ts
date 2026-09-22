import express from 'express';
import type { Request, Response } from 'express';

import { requireAuth, validate} from './auth.middlewares.js';
import { loginValidator, registrationValidator} from './auth.validators.js';
import { login, logout, checkAuth, register} from './auth.controllers.js';
import { uploadImageConfig } from '../files/files.middlewares.ts';

const router = express.Router();

router.post('/login', loginValidator, validate, login);
router.post('/logout', logout);
router.post('/register', uploadImageConfig.single('avatar'), registrationValidator, validate, register);
router.get('/check-auth', requireAuth, checkAuth);
export default router;
