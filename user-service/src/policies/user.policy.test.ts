import { UserPolicy } from '../policies/user.policy';
import { AppDataSource } from '../utils/database';
import { User } from '../models/user.model';

jest.mock('../utils/database', () => ({
    AppDataSource: {
        getRepository: jest.fn(),
    },
}));

describe('UserPolicy', () => {
    it('returns true if email is not already registered', async () => {
        const mockRepository = {
            findOne: jest.fn().mockResolvedValue(null),
        };
        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

        const result = await UserPolicy.canRegister('newuser@example.com');
        expect(result).toBe(true);
        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { user_email: 'newuser@example.com' } });
    });

    it('returns false if email is already registered', async () => {
        const mockRepository = {
            findOne: jest.fn().mockResolvedValue({ user_email: 'existinguser@example.com' }),
        };
        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

        const result = await UserPolicy.canRegister('existinguser@example.com');
        expect(result).toBe(false);
        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { user_email: 'existinguser@example.com' } });
    });

    it('handles errors gracefully when repository throws an exception', async () => {
        const mockRepository = {
            findOne: jest.fn().mockRejectedValue(new Error('Database error')),
        };
        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

        await expect(UserPolicy.canRegister('erroruser@example.com')).rejects.toThrow('Database error');
        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { user_email: 'erroruser@example.com' } });
    });
});