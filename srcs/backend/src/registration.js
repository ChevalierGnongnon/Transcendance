const express = require('express');
const bcrypt = require('bcrypt');
const database = require('./db-connexion.js');
const router = express.Router();

router.post('/register', async(req, res) =>{
    const { name, last_name, email, password, passwordVerify, birthdate } = req.body;
    if (!name || !last_name || !email || !password || !passwordVerify || !birthdate)
        return (res.status(400).json({error: 'All fields are required'}));
})