import express from 'express'
import database from '../../config/db-connexion';
const router = express.Router();
import { RowDataPacket } from 'mysql2';
import { Request, Response } from 'express';
import checkAuthToken from '../../middlewares/check-auth-token';

router.get('/change-password', checkAuthToken, async(req: Request, res: Response)=>{
    if (!req.account || typeof req.account === 'string')
        return (res.status(401).json({ error: 'INVALID_TOKEN' }));


})

router.get('/change-account-infos', checkAuthToken, async(req: Request, res: Response)=>{
    if (!req.account || typeof req.account === 'string')
        return (res.status(401).json({ error: 'INVALID_TOKEN' }));
})

router.get('/change-profile-photo', checkAuthToken, async(req: Request, res: Response)=>{
    if (!req.account || typeof req.account === 'string')
        return (res.status(401).json({ error: 'INVALID_TOKEN' }));
})

router.get('/delete-game-stats', checkAuthToken, async(req: Request, res: Response)=>{
    if (!req.account || typeof req.account === 'string')
        return (res.status(401).json({ error: 'INVALID_TOKEN' }));
})

router.get('/delete-account', checkAuthToken, async(req: Request, res: Response)=>{
    if (!req.account || typeof req.account === 'string')
        return (res.status(401).json({ error: 'INVALID_TOKEN' }));
})

export default router;