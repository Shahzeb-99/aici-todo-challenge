import {AppDataSource} from '../utils/database';
import {User} from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
    public async registerUser( user_email: string, user_pwd: string) {
        const userRepository = AppDataSource.getRepository(User);

        const existingUser = await userRepository.findOne({ where: { user_email } });
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(user_pwd, 10);
        const user = userRepository.create({ user_email, user_pwd: hashedPassword });
        await userRepository.save(user);

        return user;
    }

    public async loginUser(user_email: string, user_pwd: string) {
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({ where: { user_email } });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(user_pwd, user.user_pwd);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        return jwt.sign({ uuid: user.uuid }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    }
}

export default new UserService();