import TodoService from '../services/todo.service';
import {AppDataSource} from '../utils/database';
import {Todo} from '../models/todo.model';

jest.mock('../utils/database', () => ({
    AppDataSource: {
        getRepository: jest.fn(),
    },
}));

describe('TodoService', () => {
    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(() => {
        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
        jest.clearAllMocks();
    });

    it('creates a new todo successfully', async () => {
        const dto = {content: 'New Todo', user_uuid: 'test-user-uuid'};
        const savedTodo = {...dto};
        mockRepository.create.mockReturnValue(dto);
        mockRepository.save.mockResolvedValue(savedTodo);

        const result = await TodoService.createTodo(dto);

        expect(mockRepository.create).toHaveBeenCalledWith(dto);
        expect(mockRepository.save).toHaveBeenCalledWith(dto);
        expect(result).toEqual(savedTodo);
    });

    it('retrieves all todos for a user', async () => {
        const todos = [{id: 1, content: 'Todo 1', user_uuid: 'test-user-uuid'}];
        mockRepository.find.mockResolvedValue(todos);

        const result = await TodoService.getAllTodos('test-user-uuid');

        expect(mockRepository.find).toHaveBeenCalledWith({where: {user_uuid: 'test-user-uuid'}});
        expect(result).toEqual(todos);
    });

    it('retrieves a todo by ID successfully', async () => {
        const todo = {id: 1, content: 'Todo 1', user_uuid: 'test-user-uuid'};
        mockRepository.findOne.mockResolvedValue(todo);

        const result = await TodoService.getTodoById(1);

        expect(mockRepository.findOne).toHaveBeenCalledWith({where: {id: 1}});
        expect(result).toEqual(todo);
    });

    it('returns null when retrieving a non-existent todo by ID', async () => {
        mockRepository.findOne.mockResolvedValue(null);

        const result = await TodoService.getTodoById(999);

        expect(mockRepository.findOne).toHaveBeenCalledWith({where: {id: 999}});
        expect(result).toBeNull();
    });

    it('updates a todo successfully', async () => {
        const existingTodo = {id: 1, content: 'Old Todo', user_uuid: 'test-user-uuid'};
        const updatedTodo = {id: 1, content: 'Updated Todo', user_uuid: 'test-user-uuid'};
        mockRepository.findOne.mockResolvedValue(existingTodo);
        mockRepository.save.mockResolvedValue(updatedTodo);

        const result = await TodoService.updateTodo(1, {content: 'Updated Todo'});

        expect(mockRepository.findOne).toHaveBeenCalledWith({where: {id: 1}});
        expect(mockRepository.save).toHaveBeenCalledWith({...existingTodo, content: 'Updated Todo'});
        expect(result).toEqual(updatedTodo);
    });

    it('returns null when updating a non-existent todo', async () => {
        mockRepository.findOne.mockResolvedValue(null);

        const result = await TodoService.updateTodo(999, {content: 'Updated Todo'});

        expect(mockRepository.findOne).toHaveBeenCalledWith({where: {id: 999}});
        expect(result).toBeNull();
    });

    it('deletes a todo successfully', async () => {
        mockRepository.delete.mockResolvedValue({affected: 1});

        const result = await TodoService.deleteTodo(1);

        expect(mockRepository.delete).toHaveBeenCalledWith(1);
        expect(result).toBe(true);
    });

    it('returns false when deleting a non-existent todo', async () => {
        mockRepository.delete.mockResolvedValue({affected: 0});

        const result = await TodoService.deleteTodo(999);

        expect(mockRepository.delete).toHaveBeenCalledWith(999);
        expect(result).toBe(false);
    });
});