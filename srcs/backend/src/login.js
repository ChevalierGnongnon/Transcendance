const express = require('express');
const bcrypt = require('bcrypt');
const database = require('./db-connexion.js');
const router = express.Router();
const jwt = require('jsonwebtoken')

router.post('/login', async(req , res) =>{
    const {login, password} = req.body;

    if (!login  || !password)
        return (res.status(400).json({ error: 'ALL_FIELDS_REQUIRED'}));
    try{
        const [results] = await database.promise().query(
            'SELECT account_id, password_hash FROM account WHERE email=? OR pseudo=?', [login, login]
        );
        if (!results.length)
            return (res.status(400).json({error: 'USER_NOT_FOUND'}));
        const compare =  await bcrypt.compare(password, results[0].password_hash);
        if (!compare)
            return (res.status(400).json({error: 'INVALID_PASSWORD'}));
        const token = jwt.sign(
            { account_id: results[0].account_id },
            process.env.JWT_SECRET
        );
        res.cookie('token', token, {httpOnly : true, secure: true, sameSite: 'Strict'});
        return (res.status(200).json({success: true}));
    } catch (err){
        return (res.status(500).json({error: 'DATABASE_ERROR'}));
    }
})
module.exports = router;