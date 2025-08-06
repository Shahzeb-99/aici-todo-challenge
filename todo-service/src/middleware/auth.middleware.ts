import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user_uuid?: string;
        }
    }
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Malformed token' });
    }
    try {
        const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
        req.user_uuid = payload.uuid;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}