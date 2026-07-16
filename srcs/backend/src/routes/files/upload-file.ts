import express from 'express';
import multer from 'multer';
import jwt  from 'jsonwebtoken';
import database from '../../config/db-connexion';
// import uploadConfig from '../../config/multer-config';
import fs from 'fs';
import path from 'path';
const router = express.Router();

import { Request, Response } from 'express';


router.post('/upload', async(req: Request, res: Response) =>{
    
})