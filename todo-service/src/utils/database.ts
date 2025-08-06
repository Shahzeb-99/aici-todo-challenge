import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Todo } from '../models/todo.model';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Ensures that all required database environment variables are set.
 * Throws an error if any variable is missing.
 */
if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    throw new Error('Database environment variables are not properly set.');
}

/**
 * Configures and exports the application's data source using TypeORM.
 * The data source is connected to a PostgreSQL database and includes
 * the `User` entity, with synchronization enabled.
 */
    export const AppDataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: true,
        logging: false,
        entities: [Todo],
        subscribers: [],
        migrations: ['src/migrations/*.ts'],
    });