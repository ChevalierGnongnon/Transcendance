const express = require('express');
const jwt = require('jsonwebtoken');
const database = require('./db-connexion.js');
const router = express.Router()

router.post('/complete-profile', async(req, res) =>{
    const {pseudo, avatar, token} =  req.body;
    let decoded;

    if (!pseudo || !avatar || !token)
        return res.status(400).json({ error: 'All fields are required' });
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    try{
        const [results] = await database.promise().query(
            'SELECT account_id FROM account WHERE pseudo = ?', [pseudo]
        );
        if (results.length > 0)
            return res.status(409).json({ error: 'Pseudo already exists!' });
        await database.promise().query(
            'INSERT INTO account (name, last_name, email, password_hash, birthdate, pseudo, profile_photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [decoded.name, decoded.last_name, decoded.email, decoded.password_hash, decoded.birthdate, pseudo, avatar]
        );
        console.log('profile completed');
        return res.status(201).json({ message: 'Account created' });
    } catch (err) {
        console.error(err);
        return (res.status(500).json({error: 'database error'}));
    }
})
module.exports = router;