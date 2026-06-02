const express = require('express');
const bcrypt = require('bcrypt');
const database = require('./db-connexion.js');
const router = express.Router();
const jwt = require('jsonwebtoken')

router.post('/register', async(req, res) =>{
    const { name, last_name, email, password, passwordVerify, birthdate } = req.body;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{12,}$/;

    if (!name || !last_name || !email || !password || !passwordVerify || !birthdate)
        return (res.status(400).json({ error: 'All fields are required'}));
    if (!emailRegex.test(email))
        return (res.status(400).json({ error: 'Invalid email format' }));
    if (!passwordRegex.test(password))
        return (res.status(400).json({ error: 'Invalid password format (1 uppercase, 1 lowercase, 1 digit, 1 special char and 12 char min.)' }));
    if (password !== passwordVerify)
        return (res.status(400).json({ error: 'Passwords are not the same' }));
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0))
        age--;
    if (age < 18)
        return res.status(400).json({ error: 'You must be at least 18 years old' });
    try{
        const [results] = await database.promise().query(
            'SELECT account_id FROM account WHERE email = ?', [email]
        );
        if (results.length > 0)
            return res.status(409).json({ error: 'Email already exists!' });
        const hashed = await bcrypt.hash(password, 12);
        const token = jwt.sign(
            {name, last_name, email, password_hash : hashed, birthdate},
            process.env.JWT_SECRET
        );
        return res.status(200).json({ token });
    } catch (err) {
        return (res.status(500).json({error: 'database error'}));
    }
})
module.exports = router;