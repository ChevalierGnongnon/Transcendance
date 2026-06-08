const express = require('express');
const jwt = require('jsonwebtoken');
const database = require('./db-connexion.js');
const router = express.Router();

router.get('/my-profile', async(req, res)=>{
    const authHeader = req.header['authorization']
})
module.exports = router;