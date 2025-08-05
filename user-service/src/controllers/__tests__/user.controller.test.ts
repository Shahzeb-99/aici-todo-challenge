// src/controllers/__tests__/user.controller.test.ts
import 'reflect-metadata';
import request from 'supertest';
import express from 'express';
import UserController from '../user.controller';
import UserService from '../../services/user.service';
import {UserPolicy} from '../../policies/user.policy';
import {validate} from 'class-validator';

jest.mock('../../services/user.service');
jest.mock('../../policies/user.policy');
jest.mock('class-validator');

const app = express();
app.use(express.json());
app.post('/register', (req, res) => UserController.register(req, res));
app.post('/login', (req, res) => UserController.login(req, res));

describe('UserController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a user with valid data', async () => {
            (validate as jest.MockedFunction<typeof validate>).mockResolvedValue([]);
            (UserPolicy.canRegister as jest.MockedFunction<typeof UserPolicy.canRegister>).mockResolvedValue(true);
            (UserService.registerUser as jest.MockedFunction<typeof UserService.registerUser>).mockResolvedValue({
                id: 1,
                user_email: 'test@example.com',
                uuid: '123e4567-e89b-12d3-a456-426614174000',
                user_pwd: 'hashedpassword'
            });

            const res = await request(app)
                .post('/register')
                .send({user_email: 'test@example.com', user_pwd: 'password123'});

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('User registered successfully');
            expect(res.body.user).toHaveProperty('id', 1);
        });

        it('should return 400 for invalid data', async () => {
            (validate as jest.MockedFunction<typeof validate>).mockResolvedValue([
                { property: 'user_email', constraints: { isEmail: 'Invalid email' } }
            ]);
            const res = await request(app)
                .post('/register')
                .send({user_email: 'invalid', user_pwd: '123'});

            expect(res.status).toBe(400);
        });

        it('should return 400 if email already exists', async () => {
            (validate as jest.MockedFunction<typeof validate>).mockResolvedValue([]);
            (UserPolicy.canRegister as jest.MockedFunction<typeof UserPolicy.canRegister>).mockResolvedValue(false);

            const res = await request(app)
                .post('/register')
                .send({user_email: 'test@example.com', user_pwd: 'password123'});

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Email already exists');
        });
    });

    describe('login', () => {
        it('should login with valid credentials', async () => {
            (UserService.loginUser as jest.MockedFunction<typeof UserService.loginUser>).mockResolvedValue('token123');

            const res = await request(app)
                .post('/login')
                .send({user_email: 'test@example.com', user_pwd: 'password123'});

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Login successful');
            expect(res.body.token).toBe('token123');
        });

        it('should return 401 for invalid credentials', async () => {
            (UserService.loginUser as jest.MockedFunction<typeof UserService.loginUser>).mockRejectedValue(new Error('Invalid email or password'));

            const res = await request(app)
                .post('/login')
                .send({user_email: 'test@example.com', user_pwd: 'wrongpassword'});

            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Invalid email or password');
        });
    });
});