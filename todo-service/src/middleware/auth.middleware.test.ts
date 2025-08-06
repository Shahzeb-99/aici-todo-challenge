import { authenticateJWT } from './auth.middleware';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('authenticateJWT middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {

        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('returns 401 if no authorization header is provided', () => {
        authenticateJWT(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 401 if the token is malformed', () => {
        req.headers = { authorization: 'Bearer' };

        authenticateJWT(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Malformed token' });
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 401 if the token is invalid', () => {
        req.headers = { authorization: 'Bearer invalidtoken' };
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('Invalid token');
        });

        authenticateJWT(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
        expect(next).not.toHaveBeenCalled();
    });

    it('sets user_uuid and calls next if the token is valid', () => {
        req.headers = { authorization: 'Bearer validtoken' };
        (jwt.verify as jest.Mock).mockReturnValue({ uuid: '12345' });

        authenticateJWT(req as Request, res as Response, next);

        expect(req.user_uuid).toBe('12345');
        expect(next).toHaveBeenCalled();
    });
});