import { AppDataSource } from '../utils/database';
import { User } from '../models/user.model';

export class UserPolicy {
    static async canRegister(user_email: string): Promise<boolean> {
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({ where: { user_email } });
        return !existingUser;
    }
}