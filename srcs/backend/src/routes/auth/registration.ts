import express from 'express'
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';

import database from '../../config/db-connexion';
import rateLimit from '../../middlewares/rate-limiter';

interface RegisterBody{
    name: string;
    last_name: string;
    email: string;
    password: string;
    passwordVerify: string;
    birthdate: string
}

router.post('/', rateLimit, async(req: Request<{}, {}, RegisterBody>, res: Response) =>{
    const { name, last_name, email, password, passwordVerify, birthdate } = req.body;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{12,}$/;

    if (!name || !last_name || !email || !password || !passwordVerify || !birthdate)
        return (res.status(400).json({ error: 'ALL_FIELDS_REQUIRED'}));
    if (!emailRegex.test(email))
        return (res.status(400).json({ error: 'INVALID_EMAIL' }));
    if (!passwordRegex.test(password))
        return (res.status(400).json({ error: 'INVALID_PASSWORD_REGISTRATION' }));
    
    if (password !== passwordVerify)
        return (res.status(400).json({ error: 'PASSWORDS_NOT_SAME' }));
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0))
        age--;
    if (isNaN(birth.getTime()))
        return res.status(400).json({ error: 'INVALID_BIRTHDATE' });
    if (age < 18)
        return (res.status(400).json({ error: 'TOO_YOUNG' }));
    try{
        const [results] = await database.promise().query<RowDataPacket[]>(
            'SELECT account_id FROM account WHERE email = ?', [email]
        );
        if (results.length > 0)
            return res.status(409).json({ error: 'EMAIL_EXISTS' });
        const hashed = await bcrypt.hash(password, 12);
        if (!process.env.JWT_SECRET)
            return res.status(500).json({ error: 'SERVER_MISCONFIGURED' });
        const token = jwt.sign(
            { name, last_name, email, password_hash: hashed, birthdate },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.cookie('tmp_token', token, { httpOnly: true, secure: true, sameSite: 'strict' , expires: new Date(Date.now() + (24 * 60 * 60 * 1000))})
        return res.status(200).json({ success: true });
    } catch (err) {
        return (res.status(500).json({error: 'DATABASE_ERROR'}));
    }
})
export = router;
