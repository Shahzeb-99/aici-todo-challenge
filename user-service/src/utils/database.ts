import 'reflect-metadata';
    import { DataSource } from 'typeorm';
    import { User } from '../models/user.model';
    import dotenv from 'dotenv';

    dotenv.config();

    if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
        throw new Error('Database environment variables are not properly set.');
    }

    export const AppDataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: true,
        logging: false,
        entities: [User],
        subscribers: [],
        migrations: ['src/migrations/*.ts'],
    });