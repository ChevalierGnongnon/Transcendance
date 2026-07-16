const express = require('express');
const bcrypt = require('bcrypt');
const database = require('../../config/db-connexion');
const router = express.Router();
const rateLimit = require('../../middlewares/rate-limiter');
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

router.post('/login', rateLimit, async(req: Request , res: Response) =>{
    const {login, password} = req.body;

    if (!login  || !password)
        return (res.status(400).json({ error: 'ALL_FIELDS_REQUIRED'}));
    try{
        const [results] = await database.promise().query(
            'SELECT account_id, password_hash FROM account WHERE email=? OR pseudo=?', [login, login]
        );
        if (!results.length)
            return (res.status(400).json({error: 'INVALID_CREDENTIALS'}));
        const compare =  await bcrypt.compare(password, results[0].password_hash);
        if (!compare)
            return (res.status(400).json({error: 'INVALID_CREDENTIALS'}));
        if (!process.env.JWT_SECRET)
            return res.status(500).json({ error: 'SERVER_MISCONFIGURED' });
        const token = jwt.sign(
            { account_id: results[0].account_id },
            process.env.JWT_SECRET,
            { expiresIn:'24h' },
        );
        res.cookie('token', token, {httpOnly : true, secure: true, sameSite: 'strict', expires: new Date(Date.now() + (24 * 60 * 60 * 1000))});
        return (res.status(200).json({success: true}));
    } catch (err){
        return (res.status(500).json({error: 'DATABASE_ERROR'}));
    }
})
module.exports = router;