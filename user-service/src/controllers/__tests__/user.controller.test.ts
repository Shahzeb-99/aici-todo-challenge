import UserController from '../user.controller';
import UserService from '../../services/user.service';
import { UserPolicy } from '../../policies/user.policy';
import { UserResource } from '../../resources/user.resource';
import { RegisterUserDto } from '../../validations/user.validation';
import { validate } from 'class-validator';

jest.mock('../../services/user.service');
jest.mock('../../policies/user.policy');
jest.mock('../../resources/user.resource');

// Only mock the validate function, not the whole class-validator module
jest.spyOn(require('class-validator'), 'validate');

const mockRequest = (body: any) => ({ body } as any);
const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('UserController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('returns 400 if validation fails', async () => {
            (validate as jest.Mock).mockResolvedValue([{}]);
            const req = mockRequest({ user_email: '', user_pwd: '' });
            const res = mockResponse();

            await UserController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalled();
        });

        it('returns 400 if email already exists', async () => {
            (validate as jest.Mock).mockResolvedValue([]);
            (UserPolicy.canRegister as jest.Mock).mockResolvedValue(false);
            const req = mockRequest({ user_email: 'test@example.com', user_pwd: 'password123' });
            const res = mockResponse();

            await UserController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists' });
        });

        it('returns 201 if registration succeeds', async () => {
            (validate as jest.Mock).mockResolvedValue([]);
            (UserPolicy.canRegister as jest.Mock).mockResolvedValue(true);
            (UserService.registerUser as jest.Mock).mockResolvedValue({ id: 1, user_email: 'test@example.com' });
            (UserResource as jest.Mock).mockImplementation(user => user);

            const req = mockRequest({ user_email: 'test@example.com', user_pwd: 'password123' });
            const res = mockResponse();

            await UserController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User registered successfully',
                user: { id: 1, user_email: 'test@example.com' }
            });
        });

        it('returns 400 if service throws error', async () => {
            (validate as jest.Mock).mockResolvedValue([]);
            (UserPolicy.canRegister as jest.Mock).mockResolvedValue(true);
            (UserService.registerUser as jest.Mock).mockRejectedValue(new Error('fail'));

            const req = mockRequest({ user_email: 'test@example.com', user_pwd: 'password123' });
            const res = mockResponse();

            await UserController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
        });
    });

    describe('login', () => {
        it('returns 200 and token if login succeeds', async () => {
            (UserService.loginUser as jest.Mock).mockResolvedValue('jwt-token');
            const req = mockRequest({ user_email: 'test@example.com', user_pwd: 'password123' });
            const res = mockResponse();

            await UserController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Login successful', token: 'jwt-token' });
        });

        it('returns 401 if login fails', async () => {
            (UserService.loginUser as jest.Mock).mockRejectedValue(new Error('Invalid email or password'));
            const req = mockRequest({ user_email: 'test@example.com', user_pwd: 'wrong' });
            const res = mockResponse();

            await UserController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
        });
    });
});