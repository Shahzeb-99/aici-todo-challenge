import 'reflect-metadata';
import { IsEmail, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for registering a new user.
 * Validates the input data for user registration.
 */
export class RegisterUserDto {
    /**
     * The email address of the user.
     * Must be a valid email format.
     */
    @IsEmail()
    user_email!: string;

    /**
     * The password of the user.
     * Must be at least 6 characters long.
     */
    @MinLength(6)
    user_pwd!: string;
}