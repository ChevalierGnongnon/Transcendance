import fs from 'fs';
import express from 'express';
import bcrypt from 'bcrypt';
import database from '../../config/db-connexion';
const router = express.Router();
import rateLimit from '../../middlewares/rate-limiter';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

const github_id = fs.readFileSync('/run/secrets/OAuth_client_github_id', 'utf8').trim();
const github_secret = fs.readFileSync('/run/secrets/OAuth_client_github_secret', 'utf8').trim();

router.get('/auth/github', rateLimit, (req:Request, res:Response) => {

})

router.get('/auth/github/callback', rateLimit, async(req: Request, res: Response) => {
     
})
export = router;