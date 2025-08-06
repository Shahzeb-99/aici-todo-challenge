import { Request, Response } from 'express';
    import { validate } from 'class-validator';
    import UserService from '../services/user.service';
    import { RegisterUserDto } from '../validations/user.validation';
    import { UserPolicy } from '../policies/user.policy';
    import { UserResource } from '../resources/user.resource';

    class UserController {
        public async register(req: Request, res: Response): Promise<Response> {
            const dto = Object.assign(new RegisterUserDto(), req.body);
            const errors = await validate(dto);
            if (errors.length) {
                return res.status(400).json(errors);
            }

            const canRegister = await UserPolicy.canRegister(dto.user_email);
            if (!canRegister) {
                return res.status(401).json({ error: 'Email already exists' });
            }

            try {
                const user = await UserService.registerUser(dto.user_email, dto.user_pwd);
                return res.status(201).json({ message: 'User registered successfully', user: new UserResource(user) });
            } catch (error: any) {
                return res.status(400).json({ error: error.message });
            }
        }

        public async login(req: Request, res: Response): Promise<Response> {
            try {
                const { user_email, user_pwd } = req.body;
                const token = await UserService.loginUser(user_email, user_pwd);
                return res.status(200).json({ message: 'Login successful', token });
            } catch (error: any) {
                return res.status(401).json({ error: error.message });
            }
        }
    }

    export default new UserController();