import { Request, Response } from 'express';
const express = require('express');
const router = express.Router();
const checkAuthToken = require('../../middlewares/check-auth-token');

router.get('/check-auth', checkAuthToken, (req: Request, res: Response) => {
    res.status(200).json({authenticated: true});
});
module.exports = router;