import request from 'supertest';
import app from '../index';

jest.mock('../middleware/auth.middleware', () => ({
    authenticateJWT: (req: any, res: any, next: any) => {
        req.user_uuid = 'test-user-uuid';
        next();
    },
}));

jest.mock('../utils/database', () => ({
    AppDataSource: {
        initialize: jest.fn().mockResolvedValue(true),
        getRepository: jest.fn(() => ({
            find: jest.fn().mockResolvedValue([{id: 1, content: 'Test Todo', user_uuid: 'test-user-uuid'}]),
            create: jest.fn().mockImplementation((data) => data),
            save: jest.fn().mockResolvedValue({id: 1, content: 'Test Todo', user_uuid: 'test-user-uuid'}),
            findOne: jest.fn().mockResolvedValue({id: 1, content: 'Test Todo', user_uuid: 'test-user-uuid'}),
            update: jest.fn().mockResolvedValue({affected: 1}),
            delete: jest.fn().mockResolvedValue({affected: 1}),
        })),
    },
}));

describe('Todo Routes', () => {
    it('should create a new todo', async () => {
        const response = await request(app)
            .post('/')
            .set('Authorization', 'Bearer valid-jwt-token')
            .send({content: 'Test Todo'});

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('content', 'Test Todo');
    });

    it('should get all todos', async () => {
        const response = await request(app)
            .get('/')
            .set('Authorization', 'Bearer valid-jwt-token');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should update a todo', async () => {
        const response = await request(app)
            .put('/1')
            .set('Authorization', 'Bearer valid-jwt-token')
            .send({content: 'Updated Todo'});

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('content', 'Updated Todo');
    });

    it('should delete a todo', async () => {
        const response = await request(app)
            .delete('/1')
            .set('Authorization', 'Bearer valid-jwt-token');

        expect(response.status).toBe(204);
    });
});