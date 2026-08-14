import express from 'express'
const router = express.Router();
import { RowDataPacket } from 'mysql2';
import { Request, Response } from 'express';
import checkAuthToken from '../../middlewares/check-auth-token';

const redirectWhenConnected = (req: Request, res: Response) => {
    
}