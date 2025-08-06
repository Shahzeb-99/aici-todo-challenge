import {Request, Response} from 'express';
import {validate} from 'class-validator';
import TodoService from '../services/todo.service';
import {CreateTodoDto, UpdateTodoDto} from '../validations/todo.validation';
import {TodoPolicy} from '../policies/todo.policy';
import {TodoResource} from '../resources/todo.resource';

class TodoController {

    constructor() {
        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }


    // Helper method for consistent error responses
    private error(res: Response, status: number, message: string): Response {
        return res.status(status).json({
            success: false,
            message: message,
            data: null,
        });
    }

    // Helper method for consistent success responses
    private success(res: Response, status: number, message: string, data: any = null): Response {
        return res.status(status).json({
            success: true,
            message: message,
            data: data,
        });
    }

    public async create(req: Request, res: Response): Promise<Response> {
        const dto = Object.assign(new CreateTodoDto(), req.body);
        dto.user_uuid = req.user_uuid as string;

        if (!TodoPolicy.canCreate(dto.user_uuid)) {
            return this.error(res, 403, 'Forbidden');
        }

        const errors = await validate(dto);
        if (errors.length) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                data: errors,
            });
        }

        try {
            const todo = await TodoService.createTodo(dto);
            return this.success(res, 201, 'Todo created successfully', new TodoResource(todo));
        } catch (error: any) {
            return this.error(res, 400, error.message);
        }
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const todos = await TodoService.getAllTodos(req.user_uuid as string);
            return this.success(res, 200, 'Todos fetched successfully', todos.map(todo => new TodoResource(todo)));
        } catch (error: any) {
            return this.error(res, 400, error.message);
        }
    }

    public async getById(req: Request, res: Response): Promise<Response> {
        const id = Number(req.params.id);

        try {
            const todo = await TodoService.getTodoById(id);
            if (!todo) {
                return this.error(res, 404, 'Todo not found');
            }
            if (!TodoPolicy.canView(todo, req.user_uuid as string)) {
                return this.error(res, 403, 'Forbidden');
            }
            return this.success(res, 200, 'Todo fetched successfully', new TodoResource(todo));
        } catch (error: any) {
            return this.error(res, 400, error.message);
        }
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const id = Number(req.params.id);
        const dto = Object.assign(new UpdateTodoDto(), req.body);

        const todo = await TodoService.getTodoById(id);
        if (!todo) {
            return this.error(res, 404, 'Todo not found');
        }

        if (!TodoPolicy.canUpdate(todo, req.user_uuid as string)) {
            return this.error(res, 403, 'Forbidden');
        }

        const errors = await validate(dto);
        if (errors.length) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                data: errors,
            });
        }

        try {
            const updated = await TodoService.updateTodo(id, dto);
            return this.success(res, 200, 'Todo updated successfully', new TodoResource(updated));
        } catch (error: any) {
            return this.error(res, 400, error.message);
        }
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const id = Number(req.params.id);

        const todo = await TodoService.getTodoById(id);
        if (!todo) {
            return this.error(res, 404, 'Todo not found');
        }

        if (!TodoPolicy.canDelete(todo, req.user_uuid as string)) {
            return this.error(res, 403, 'Forbidden');
        }

        try {
            const deleted = await TodoService.deleteTodo(id);
            if (!deleted) {
                return this.error(res, 404, 'Todo not found');
            }
            return this.success(res, 204, 'Todo deleted successfully');
        } catch (error: any) {
            return this.error(res, 400, error.message);
        }
    }
}

export default new TodoController();