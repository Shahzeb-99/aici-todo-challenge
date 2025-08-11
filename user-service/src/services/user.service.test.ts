import UserService from '../services/user.service';
import { AppDataSource } from '../utils/database';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../utils/database', () => ({
    AppDataSource: {
        getRepository: jest.fn(),
    },
}));
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('registers a new user when email is not taken', async () => {
            const mockRepository = {
                findOne: jest.fn().mockResolvedValue(null),
                create: jest.fn().mockReturnValue({ id: 1, user_email: 'new@example.com', user_pwd: 'hashed' }),
                save: jest.fn().mockResolvedValue({ id: 1, user_email: 'new@example.com', user_pwd: 'hashed' }),
            };
            (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

            const user = await UserService.registerUser('new@example.com', 'password123');
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { user_email: 'new@example.com' } });
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(user).toHaveProperty('id', 1);
        });

        it('throws error if email already exists', async () => {
            const mockRepository = {
                findOne: jest.fn().mockResolvedValue({ user_email: 'existing@example.com' }),
            };
            (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

            await expect(UserService.registerUser('existing@example.com', 'password123'))
                .rejects.toThrow('Email already exists');
        });
    });

    describe('loginUser', () => {
        it('returns JWT for valid credentials', async () => {
            const mockUser = { uuid: 'uuid-1', user_email: 'user@example.com', user_pwd: 'hashed' };
            const mockRepository = {
                findOne: jest.fn().mockResolvedValue(mockUser),
            };
            (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('jwt-token');

            process.env.JWT_SECRET = 'secret';
            const token = await UserService.loginUser('user@example.com', 'password123');
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { user_email: 'user@example.com' } });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed');
            expect(token).toBe('jwt-token');
        });

        it('throws error if user does not exist', async () => {
            const mockRepository = {
                findOne: jest.fn().mockResolvedValue(null),
            };
            (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

            await expect(UserService.loginUser('nouser@example.com', 'password123'))
                .rejects.toThrow('Invalid email or password');
        });

        it('throws error if password does not match', async () => {
            const mockUser = { uuid: 'uuid-1', user_email: 'user@example.com', user_pwd: 'hashed' };
            const mockRepository = {
                findOne: jest.fn().mockResolvedValue(mockUser),
            };
            (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(UserService.loginUser('user@example.com', 'wrongpassword'))
                .rejects.toThrow('Invalid email or password');
        });
    });
});