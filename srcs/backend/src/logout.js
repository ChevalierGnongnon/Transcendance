const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
    const   infos = req.cookies.token;
    
    if (!infos)
        return (res.status(401).json({error: 'INVALID_TOKEN'}));
    res.clearCookie('token');
    return (res.status(200).json({authenticated : false }));
})
module.exports = router;