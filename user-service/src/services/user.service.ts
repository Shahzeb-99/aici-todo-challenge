import { AppDataSource } from '../utils/database';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
    /**
     * Registers a new user in the system.
     *
     * @param {string} user_email - The email address of the user to register.
     * @param {string} user_pwd - The plain text password of the user to register.
     * @throws {Error} If the email already exists in the database.
     * @returns {Promise<User>} - The newly created user object.
     */
    public async registerUser(user_email: string, user_pwd: string) {
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

    /**
     * Logs in a user by validating their credentials and generating a JWT.
     *
     * @param {string} user_email - The email address of the user attempting to log in.
     * @param {string} user_pwd - The plain text password of the user attempting to log in.
     * @throws {Error} If the email does not exist or the password is invalid.
     * @returns {Promise<string>} - A JWT token for the authenticated user.
     */
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