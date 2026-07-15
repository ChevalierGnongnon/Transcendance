const express = require('express');
const router = express.Router();
const checkAuthToken = require('../../middlewares/check-auth-token.js');

router.get('/check-auth', checkAuthToken, (req, res) => {
    res.status(200).json({authenticated: true});
});
module.exports = router;