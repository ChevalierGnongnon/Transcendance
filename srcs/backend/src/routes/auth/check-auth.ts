import { Request, Response } from 'express';
import express from 'express';
import checkAuthToken from '../../middlewares/check-auth-token';

const router = express.Router();

router.get('/check-auth', checkAuthToken, (req: Request, res: Response) => {
    res.status(200).json({authenticated: true});
});
export = router;