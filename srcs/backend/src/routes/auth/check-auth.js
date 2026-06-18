const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/check-auth', (req, res) => {
    const   infos = req.cookies.token;
    let     decoded;
    
    if (!infos)
        return (res.status(401).json({error: 'USER_NOT_FOUND'}));
    try{
        decoded = jwt.verify(infos, process.env.JWT_SECRET);
        if (decoded)
            return (res.status(200).json({ authenticated: true }));
    }  catch(err) {
        return res.status(401).json({ error: 'INVALID_TOKEN' });
    }
})
module.exports = router;