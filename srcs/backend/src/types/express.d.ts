import 'express';
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            account?: string | JwtPayload;
        }
    }
}
