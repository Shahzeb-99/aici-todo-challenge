import { TodoResource } from './todo.resource';

describe('TodoResource', () => {
    it('creates a resource with valid todo data', () => {
        const todo = { uuid: '123e4567-e89b-12d3-a456-426614174000', content: 'Sample Todo' };
        const resource = new TodoResource(todo);

        expect(resource.uuid).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(resource.content).toBe('Sample Todo');
    });

    it('handles missing uuid in todo data', () => {
        const todo = { content: 'Sample Todo' };
        const resource = new TodoResource(todo);

        expect(resource.uuid).toBeUndefined();
        expect(resource.content).toBe('Sample Todo');
    });

    it('handles missing content in todo data', () => {
        const todo = { uuid: '123e4567-e89b-12d3-a456-426614174000' };
        const resource = new TodoResource(todo);

        expect(resource.uuid).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(resource.content).toBeUndefined();
    });

    it('handles empty todo data', () => {
        const todo = {};
        const resource = new TodoResource(todo);

        expect(resource.uuid).toBeUndefined();
        expect(resource.content).toBeUndefined();
    });
});