import express from 'express';
import database from '../../config/db-connexion';
const router = express.Router();
import { RowDataPacket } from 'mysql2';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'

router.get('/my-profile', async(req: Request, res: Response)=>{
    const token = req.cookies.token;
    let decoded;

    if (!token)
        return (res.status(401).json({ error: 'INVALID_TOKEN' }));
    try{
        if (!process.env.JWT_SECRET)
            return res.status(500).json({ error: 'SERVER_MISCONFIGURED' });
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return (res.status(401).json({ error: 'INVALID_TOKEN' }));
    }
    if (typeof decoded === 'string')
        return res.status(401).json({ error: 'INVALID_TOKEN' });
    try{
        const [account_personal_infos] = await database.promise().query<RowDataPacket[]>(
            'SELECT account.name, account.last_name, account.email, account.pseudo, file.file_name\
            FROM account\
            LEFT JOIN file ON account.profile_photo_id = file.file_id\
            WHERE account.account_id = ?', [decoded.account_id]
        );
        return (res.status(200).json(account_personal_infos[0]));
    }
    catch (err) {
        return (res.status(500).json({ error: 'DATABASE_ERROR' }));
    }
})
export = router;