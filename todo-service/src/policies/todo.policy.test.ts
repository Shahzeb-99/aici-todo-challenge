import { TodoPolicy } from './todo.policy';
import { Todo } from '../models/todo.model';

describe('TodoPolicy', () => {
    it('allows creation if user UUID is provided', () => {
        const result = TodoPolicy.canCreate('123e4567-e89b-12d3-a456-426614174000');
        expect(result).toBe(true);
    });

    it('denies creation if user UUID is not provided', () => {
        const result = TodoPolicy.canCreate('');
        expect(result).toBe(false);
    });

    it('allows viewing if user owns the todo', () => {
        const todo = { user_uuid: '123e4567-e89b-12d3-a456-426614174000' } as Todo;
        const result = TodoPolicy.canView(todo, '123e4567-e89b-12d3-a456-426614174000');
        expect(result).toBe(true);
    });

    it('denies viewing if user does not own the todo', () => {
        const todo = { user_uuid: '123e4567-e89b-12d3-a456-426614174000' } as Todo;
        const result = TodoPolicy.canView(todo, '987e6543-e21b-34d3-b654-426614174999');
        expect(result).toBe(false);
    });

    it('allows updating if user owns the todo', () => {
        const todo = { user_uuid: '123e4567-e89b-12d3-a456-426614174000' } as Todo;
        const result = TodoPolicy.canUpdate(todo, '123e4567-e89b-12d3-a456-426614174000');
        expect(result).toBe(true);
    });

    it('denies updating if user does not own the todo', () => {
        const todo = { user_uuid: '123e4567-e89b-12d3-a456-426614174000' } as Todo;
        const result = TodoPolicy.canUpdate(todo, '987e6543-e21b-34d3-b654-426614174999');
        expect(result).toBe(false);
    });

    it('allows deletion if user owns the todo', () => {
        const todo = { user_uuid: '123e4567-e89b-12d3-a456-426614174000' } as Todo;
        const result = TodoPolicy.canDelete(todo, '123e4567-e89b-12d3-a456-426614174000');
        expect(result).toBe(true);
    });

    it('denies deletion if user does not own the todo', () => {
        const todo = { user_uuid: '123e4567-e89b-12d3-a456-426614174000' } as Todo;
        const result = TodoPolicy.canDelete(todo, '987e6543-e21b-34d3-b654-426614174999');
        expect(result).toBe(false);
    });
});