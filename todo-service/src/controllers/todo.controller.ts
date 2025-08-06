import {Request, Response} from 'express';
import {validate} from 'class-validator';
import TodoService from '../services/todo.service';
import {CreateTodoDto, UpdateTodoDto} from '../validations/todo.validation';
import {TodoPolicy} from '../policies/todo.policy';
import {TodoResource} from '../resources/todo.resource';

class TodoController {
    private error(res: Response, status: number, message: string) {
        return res.status(status).json({error: message});
    }

    public async create(req: Request, res: Response): Promise<Response> {
        const dto = Object.assign(new CreateTodoDto(), req.body);
        dto.user_uuid = req.user_uuid as string;
        if (!TodoPolicy.canCreate(dto.user_uuid)) {
            return this.error(res, 403, 'Forbidden');
        }
        const errors = await validate(dto);
        if (errors.length) {
            return res.status(400).json(errors);
        }
        try {
            const todo = await TodoService.createTodo(dto);
            return res.status(201).json(new TodoResource(todo));
        } catch (error: any) {
            return this.error(res, 400, error.message);
        }
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const todos = await TodoService.getAllTodos(req.user_uuid as string);
            return res.status(200).json(todos.map(todo => new TodoResource(todo)));
        } catch (error: any) {
            return this.error(res, 400, error.message);
        }
    }

    public async getById(req: Request, res: Response): Promise<Response> {
        const id = Number(req.params.id);
        try {
            const todo = await TodoService.getTodoById(id);
            if (!todo) return this.error(res, 404, 'Todo not found');
            if (!TodoPolicy.canView(todo, req.user_uuid as string)) {
                return this.error(res, 403, 'Forbidden');
            }
            return res.status(200).json(new TodoResource(todo));
        } catch (error: any) {
            return this.error(res, 400, error.message);
        }
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const id = Number(req.params.id);
        const dto = Object.assign(new UpdateTodoDto(), req.body);

        // Policy: Only authenticated users can update their own todos
        const todo = await TodoService.getTodoById(id);
        if (!todo) return this.error(res, 404, 'Todo not found');
        if (!TodoPolicy.canUpdate(todo, req.user_uuid as string)) {
            return this.error(res, 403, 'Forbidden');
        }

        // Validation
        const errors = await validate(dto);
        if (errors.length) {
            return res.status(400).json(errors);
        }

        try {
            const updated = await TodoService.updateTodo(id, dto);
            return res.status(200).json(new TodoResource(updated));
        } catch (error: any) {
            return this.error(res, 400, error.message);
        }
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const id = Number(req.params.id);

        // Policy: Only authenticated users can delete their own todos
        const todo = await TodoService.getTodoById(id);
        if (!todo) return this.error(res, 404, 'Todo not found');
        if (!TodoPolicy.canDelete(todo, req.user_uuid as string)) {
            return this.error(res, 403, 'Forbidden');
        }

        try {
            const deleted = await TodoService.deleteTodo(id);
            if (!deleted) return this.error(res, 404, 'Todo not found');
            return res.status(204).send();
        } catch (error: any) {
            return this.error(res, 400, error.message);
        }
    }
}

export default new TodoController();