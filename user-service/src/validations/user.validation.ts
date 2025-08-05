import 'reflect-metadata';
import { IsEmail, MinLength } from 'class-validator';

export class RegisterUserDto {
    @IsEmail()
    user_email!: string;

    @MinLength(6)
    user_pwd!: string;
}