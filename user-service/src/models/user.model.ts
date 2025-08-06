import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

    /**
     * Represents the User entity in the database.
     * Maps to the 'users' table.
     */
    @Entity('users')
    export class User {
        /**
         * The primary key for the User entity.
         * Auto-generated integer value.
         */
        @PrimaryGeneratedColumn()
        id!: number;

        /**
         * A unique UUID for the user.
         * Defaults to a generated UUID using the `uuid_generate_v4()` function.
         */
        @Column({ type: 'uuid', unique: true, default: () => 'uuid_generate_v4()' })
        uuid!: string;

        /**
         * The email address of the user.
         * Must be unique in the database.
         */
        @Column({ name: 'user_email', unique: true })
        user_email!: string;

        /**
         * The password of the user.
         * Stored as a string in the database.
         */
        @Column({ name: 'user_pwd' })
        user_pwd!: string;
    }