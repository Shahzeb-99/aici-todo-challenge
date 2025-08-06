import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Represents the Todo entity in the database.
 * Maps to the 'todos' table.
 */
@Entity('todos')
export class Todo {
    /**
     * The primary key for the Todo entity.
     * Auto-generated integer value.
     */
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * A unique UUID for the todo item.
     * Defaults to a generated UUID using the `uuid_generate_v4()` function.
     */
    @Column({ type: 'uuid', unique: true, default: () => 'uuid_generate_v4()' })
    uuid!: string;

    /**
     * The content of the todo item.
     */
    @Column()
    content!: string;

    /**
     * The UUID of the user who owns this todo.
     */
    @Column()
    user_uuid!: string;
}