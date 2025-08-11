import TodoController from './todo.controller';
import TodoService from '../services/todo.service';
import { TodoPolicy } from '../policies/todo.policy';
import { validate } from 'class-validator';
import { TodoResource } from '../resources/todo.resource';
import { Request } from 'express';

// Only keep this mockRequest
const mockRequest = (body: any = {}, params: any = {}, user_uuid: string = 'user-uuid'): Request => {
    const req = Object.create({});
    req.body = body;
    req.params = params;
    req.user_uuid = user_uuid;
    req.get = jest.fn();
    req.header = jest.fn();
    req.accepts = jest.fn();
    req.acceptsCharsets = jest.fn();
    return req as Request;
};

jest.mock('../services/todo.service');
jest.mock('../policies/todo.policy');
jest.spyOn(require('class-validator'), 'validate');

const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('TodoController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('returns 403 if policy denies creation', async () => {
            (TodoPolicy.canCreate as jest.Mock).mockReturnValue(false);
            const req = mockRequest({ content: 'Test' });
            const res = mockResponse();

            await TodoController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
        });

        it('returns 400 if validation fails', async () => {
            (TodoPolicy.canCreate as jest.Mock).mockReturnValue(true);
            (validate as jest.Mock).mockResolvedValue([{}]);
            const req = mockRequest({ content: '' });
            const res = mockResponse();

            await TodoController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Validation failed' }));
        });

        it('returns 201 if todo is created', async () => {
            (TodoPolicy.canCreate as jest.Mock).mockReturnValue(true);
            (validate as jest.Mock).mockResolvedValue([]);
            (TodoService.createTodo as jest.Mock).mockResolvedValue({ id: 1, uuid: 'uuid', content: 'Test' });
            const req = mockRequest({ content: 'Test' });
            const res = mockResponse();

            await TodoController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('returns 400 if service throws error', async () => {
            (TodoPolicy.canCreate as jest.Mock).mockReturnValue(true);
            (validate as jest.Mock).mockResolvedValue([]);
            (TodoService.createTodo as jest.Mock).mockRejectedValue(new Error('fail'));
            const req = mockRequest({ content: 'Test' });
            const res = mockResponse();

            await TodoController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'fail' }));
        });
    });

    describe('getAll', () => {
        it('returns 200 and todos', async () => {
            (TodoService.getAllTodos as jest.Mock).mockResolvedValue([{ id: 1, uuid: 'uuid', content: 'Test' }]);
            const req = mockRequest();
            const res = mockResponse();

            await TodoController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('returns 400 if service throws error', async () => {
            (TodoService.getAllTodos as jest.Mock).mockRejectedValue(new Error('fail'));
            const req = mockRequest();
            const res = mockResponse();

            await TodoController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'fail' }));
        });
    });

    describe('getById', () => {
        it('returns 404 if todo not found', async () => {
            (TodoService.getTodoById as jest.Mock).mockResolvedValue(null);
            const req = mockRequest({}, { id: '1' });
            const res = mockResponse();

            await TodoController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('returns 403 if policy denies view', async () => {
            (TodoService.getTodoById as jest.Mock).mockResolvedValue({ user_uuid: 'other' });
            (TodoPolicy.canView as jest.Mock).mockReturnValue(false);
            const req = mockRequest({}, { id: '1' });
            const res = mockResponse();

            await TodoController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('returns 200 if todo found and policy allows', async () => {
            (TodoService.getTodoById as jest.Mock).mockResolvedValue({ id: 1, uuid: 'uuid', content: 'Test', user_uuid: 'user-uuid' });
            (TodoPolicy.canView as jest.Mock).mockReturnValue(true);
            const req = mockRequest({}, { id: '1' });
            const res = mockResponse();

            await TodoController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('returns 400 if service throws error', async () => {
            (TodoService.getTodoById as jest.Mock).mockRejectedValue(new Error('fail'));
            const req = mockRequest({}, { id: '1' });
            const res = mockResponse();

            await TodoController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'fail' }));
        });
    });

    describe('update', () => {
        it('returns 404 if todo not found', async () => {
            (TodoService.getTodoById as jest.Mock).mockResolvedValue(null);
            const req = mockRequest({ content: 'Test' }, { id: '1' });
            const res = mockResponse();

            await TodoController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('returns 403 if policy denies update', async () => {
            (TodoService.getTodoById as jest.Mock).mockResolvedValue({ user_uuid: 'other' });
            (TodoPolicy.canUpdate as jest.Mock).mockReturnValue(false);
            const req = mockRequest({ content: 'Test' }, { id: '1' });
            const res = mockResponse();

            await TodoController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('returns 400 if validation fails', async () => {
            (TodoService.getTodoById as jest.Mock).mockResolvedValue({ user_uuid: 'user-uuid' });
            (TodoPolicy.canUpdate as jest.Mock).mockReturnValue(true);
            (validate as jest.Mock).mockResolvedValue([{}]);
            const req = mockRequest({ content: '' }, { id: '1' });
            const res = mockResponse();

            await TodoController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Validation failed' }));
        });

        it('returns 200 if update succeeds', async () => {
            (TodoService.getTodoById as jest.Mock).mockResolvedValue({ id: 1, uuid: 'uuid', content: 'Test', user_uuid: 'user-uuid' });
            (TodoPolicy.canUpdate as jest.Mock).mockReturnValue(true);
            (validate as jest.Mock).mockResolvedValue([]);
            (TodoService.updateTodo as jest.Mock).mockResolvedValue({ id: 1, uuid: 'uuid', content: 'Updated', user_uuid: 'user-uuid' });
            const req = mockRequest({ content: 'Updated' }, { id: '1' });
            const res = mockResponse();

            await TodoController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('returns 400 if service throws error', async () => {
            (TodoService.getTodoById as jest.Mock).mockResolvedValue({ user_uuid: 'user-uuid' });
            (TodoPolicy.canUpdate as jest.Mock).mockReturnValue(true);
            (validate as jest.Mock).mockResolvedValue([]);
            (TodoService.updateTodo as jest.Mock).mockRejectedValue(new Error('fail'));
            const req = mockRequest({ content: 'Updated' }, { id: '1' });
            const res = mockResponse();

            await TodoController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'fail' }));
        });
    });

    describe('delete', () => {
        it('returns 404 if todo not found', async () => {
            (TodoService.getTodoById as jest.Mock).mockResolvedValue(null);
            const req = mockRequest({}, { id: '1' });
            const res = mockResponse();

            await TodoController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('returns 403 if policy denies delete', async () => {
            (TodoService.getTodoById as jest.Mock).mockResolvedValue({ user_uuid: 'other' });
            (TodoPolicy.canDelete as jest.Mock).mockReturnValue(false);
            const req = mockRequest({}, { id: '1' });
            const res = mockResponse();

            await TodoController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('returns 204 if delete succeeds', async () => {
            (TodoService.getTodoById as jest.Mock).mockResolvedValue({ user_uuid: 'user-uuid' });
            (TodoPolicy.canDelete as jest.Mock).mockReturnValue(true);
            (TodoService.deleteTodo as jest.Mock).mockResolvedValue(true);
            const req = mockRequest({}, { id: '1' });
            const res = mockResponse();

            await TodoController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('returns 404 if service returns false', async () => {
            (TodoService.getTodoById as jest.Mock).mockResolvedValue({ user_uuid: 'user-uuid' });
            (TodoPolicy.canDelete as jest.Mock).mockReturnValue(true);
            (TodoService.deleteTodo as jest.Mock).mockResolvedValue(false);
            const req = mockRequest({}, { id: '1' });
            const res = mockResponse();

            await TodoController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('returns 400 if service throws error', async () => {
            (TodoService.getTodoById as jest.Mock).mockResolvedValue({ user_uuid: 'user-uuid' });
            (TodoPolicy.canDelete as jest.Mock).mockReturnValue(true);
            (TodoService.deleteTodo as jest.Mock).mockRejectedValue(new Error('fail'));
            const req = mockRequest({}, { id: '1' });
            const res = mockResponse();

            await TodoController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'fail' }));
        });
    });
});