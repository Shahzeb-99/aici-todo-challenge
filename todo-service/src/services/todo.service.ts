import {AppDataSource} from '../utils/database';
import {Todo} from '../models/todo.model';
import {CreateTodoDto, UpdateTodoDto} from '../validations/todo.validation';


class TodoService {
    // Existing user methods...

    public async createTodo(dto: CreateTodoDto): Promise<Todo> {
        const todoRepository = AppDataSource.getRepository(Todo);
        const todo = todoRepository.create(dto);
        await todoRepository.save(todo);
        return todo;
    }

    public async getAllTodos(user_uuid: string): Promise<Todo[]> {
        const todoRepository = AppDataSource.getRepository(Todo);
        return await todoRepository.find({where: {user_uuid}});
    }

    public async getTodoById(id: number): Promise<Todo | null> {
        const todoRepository = AppDataSource.getRepository(Todo);
        return await todoRepository.findOne({where: {id}});
    }

    public async updateTodo(id: number, dto: UpdateTodoDto): Promise<Todo | null> {
        const todoRepository = AppDataSource.getRepository(Todo);
        const todo = await todoRepository.findOne({where: {id}});
        if (!todo) return null;
        Object.assign(todo, dto);
        await todoRepository.save(todo);
        return todo;
    }

    public async deleteTodo(id: number): Promise<boolean> {
        const todoRepository = AppDataSource.getRepository(Todo);
        const result = await todoRepository.delete(id);
        return result.affected !== 0;
    }
}

export default new TodoService();