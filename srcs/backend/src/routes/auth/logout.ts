import express from 'express';
const router = express.Router();
import { Request, Response } from 'express';


router.post('/logout', (req: Request, res: Response) => {
    const   infos = req.cookies.token;
    
    if (!infos)
        return (res.status(401).json({error: 'INVALID_TOKEN'}));
    res.clearCookie('token');
    return (res.status(200).json({authenticated : false }));
})
export = router;