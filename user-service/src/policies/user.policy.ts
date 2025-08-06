import { AppDataSource } from '../utils/database';
    import { User } from '../models/user.model';

    export class UserPolicy {
        /**
         * Determines if a user can register with the given email.
         *
         * @param {string} user_email - The email address to check for registration eligibility.
         * @returns {Promise<boolean>} - A promise that resolves to `true` if the email is not already registered, otherwise `false`.
         */
        static async canRegister(user_email: string): Promise<boolean> {
            const userRepository = AppDataSource.getRepository(User);
            const existingUser = await userRepository.findOne({ where: { user_email } });
            return !existingUser;
        }
    }