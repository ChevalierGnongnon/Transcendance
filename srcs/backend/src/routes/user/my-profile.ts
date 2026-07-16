const express = require('express');
const database = require('../../config/db-connexion');
const router = express.Router();

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
        const [account_personal_infos] = await database.promise().query(
            'SELECT name, last_name, email, pseudo, profile_photo_id FROM account WHERE account_id = ?', [decoded.account_id]
        );
        return (res.status(200).json(account_personal_infos[0]));
    }
    catch (err) {
        return (res.status(500).json({ error: 'DATABASE_ERROR' }));
    }
})
module.exports = router;