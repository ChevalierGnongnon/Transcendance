import express from 'express';
import type { Request, Response } from 'express';
const router = express.Router();

import { getDefaultAvatars } from './files.controllers.js';

router.get('/default-avatars', getDefaultAvatars);


export default router;
