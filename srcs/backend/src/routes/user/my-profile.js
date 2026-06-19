const express = require('express');
const jwt = require('jsonwebtoken');
const database = require('../../config/db-connexion.js');
const router = express.Router();

router.get('/my-profile', async(req, res)=>{
    const token = req.cookies.token;
    let decoded;

    if (!token)
        return (res.status(401).json({ error: 'INVALID_TOKEN' }));
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return (res.status(401).json({ error: 'INVALID_TOKEN' }));
    }
    const [account_personal_infos] = await database.promise().query(
        'SELECT name, last_name, email, pseudo, profile_photo_url FROM account WHERE account_id = ?', [decoded.account_id]
    );
    return (res.status(200).json(account_personal_infos[0]));
})
module.exports = router;