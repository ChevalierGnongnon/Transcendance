const express = require('express');
const database = require('../../config/db-connexion');
const router = express.Router()
const {randomUUID} = require('crypto');
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface completeProfileBody{
    pseudo: string;
    avatar: string;
}

router.post('/complete-profile', async(req: Request<{}, {}, completeProfileBody>, res: Response) =>{
    const token =  req.cookies.tmp_token;
    const {pseudo, avatar} = req.body;
    const pseudoRegex = /^[a-zA-Z0-9_-]{3,30}$/
    let decoded;

    if (!pseudo || !avatar || !token)
        return (res.status(400).json({ error: 'ALL_FIELDS_REQUIRED' }));
    if (!pseudoRegex.test(pseudo))
        return (res.status(400).json({ error: 'INVALID_PSEUDO'}));
    try {
        if (!process.env.JWT_SECRET)
            return res.status(500).json({ error: 'SERVER_MISCONFIGURED' });
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ error: 'INVALID_TOKEN' });
    }
    if (typeof decoded === 'string')
        return res.status(401).json({ error: 'INVALID_TOKEN' });
    try{
        const [results] = await database.promise().query(
            'SELECT account_id FROM account WHERE pseudo = ?', [pseudo]
        );
        if (results.length > 0)
            return res.status(409).json({ error: 'PSEUDO_EXISTS' });
        const id = randomUUID();
        const [insertResults] = await database.promise().query(
            'INSERT INTO account (account_id, name, last_name, email, password_hash, birthdate, pseudo, profile_photo_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, decoded.name, decoded.last_name, decoded.email, decoded.password_hash, decoded.birthdate, pseudo, avatar]
        );
        const idToken = jwt.sign({ account_id: id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.clearCookie('tmp_token');
        res.cookie('token', idToken, { httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(Date.now() + (24 * 60 * 60 * 1000))});
        return res.status(201).json({ success: true });
    } catch (err) {
        console.error(err);
        return (res.status(500).json({error: 'DATABASE_ERROR'}));
    }
})
module.exports = router;