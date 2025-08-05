import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'uuid', unique: true, default: () => 'uuid_generate_v4()' })
    uuid!: string;

    @Column({ name: 'user_email', unique: true })
    user_email!: string;

    @Column({ name: 'user_pwd' })
    user_pwd!: string;
}