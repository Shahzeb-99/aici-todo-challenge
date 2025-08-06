import 'reflect-metadata';
import {IsString, IsOptional} from 'class-validator';

/**
 * DTO for creating a new todo item.
 * Only includes content and user_uuid.
 */
export class CreateTodoDto {
    @IsString()
    content!: string;

    @IsString()
    user_uuid!: string;
}

/**
 * DTO for updating an existing todo item.
 * Only content is updatable.
 */
export class UpdateTodoDto {
    @IsOptional()
    @IsString()
    content?: string;
}