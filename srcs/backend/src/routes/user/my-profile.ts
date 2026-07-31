import express from 'express';
import database from '../../config/db-connexion';
const router = express.Router();
import { RowDataPacket } from 'mysql2';
import { Request, Response } from 'express';
import checkAuthToken from '../../middlewares/check-auth-token';

router.get('/my-profile', checkAuthToken, async(req: Request, res: Response)=>{
    if (!req.account || typeof req.account === 'string')
        return (res.status(401).json({ error: 'INVALID_TOKEN' }));
    try{
        const [account_personal_infos] = await database.promise().query<RowDataPacket[]>(
            'SELECT account.name, account.last_name, account.email, account.pseudo, file.file_name\
            FROM account\
            LEFT JOIN file ON account.profile_photo_id = file.file_id\
            WHERE account.account_id = ?', [req.account.account_id]
        );
        if (!account_personal_infos[0])
            return res.status(404).json({ error: 'ACCOUNT_NOT_FOUND' })
        return (res.status(200).json(account_personal_infos[0]));
    }
    catch (err) {
        return (res.status(500).json({ error: 'DATABASE_ERROR' }));
    }
})
export = router;