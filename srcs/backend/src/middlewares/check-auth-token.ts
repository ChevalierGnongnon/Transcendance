import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const checkAuthToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token)
        return (res.status(401).json({error: 'INVALID_TOKEN'}));
    if (!process.env.JWT_SECRET)
        return res.status(500).json({ error: 'SERVER_MISCONFIGURED' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.account = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'INVALID_TOKEN' });
    }
}
module.exports = checkAuthToken;