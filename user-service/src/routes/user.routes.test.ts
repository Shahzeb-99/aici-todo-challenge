import express from 'express';
import request from 'supertest';
import userRouter from '../routes/user.routes';
import UserController from '../controllers/user.controller';

jest.mock('../controllers/user.controller', () => ({
    register: jest.fn((req, res) => res.status(201).json({ message: 'registered' })),
    login: jest.fn((req, res) => res.status(200).json({ message: 'logged in' })),
}));

const app = express();
app.use(express.json());
app.use('/', userRouter);

describe('User Routes', () => {
    it('handles POST /register and calls UserController.register', async () => {
        const res = await request(app)
            .post('/register')
            .send({ user_email: 'test@example.com', user_pwd: 'password123' });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('registered');
        expect(UserController.register).toHaveBeenCalled();
    });

    it('handles POST /login and calls UserController.login', async () => {
        const res = await request(app)
            .post('/login')
            .send({ user_email: 'test@example.com', user_pwd: 'password123' });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('logged in');
        expect(UserController.login).toHaveBeenCalled();
    });
});