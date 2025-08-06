import {validate} from 'class-validator';
import {CreateTodoDto, UpdateTodoDto} from '../todo.validation';

describe('CreateTodoDto', () => {
    it('validates successfully with valid content and user_uuid', async () => {
        const dto = new CreateTodoDto();
        dto.content = 'Test Todo';
        dto.user_uuid = 'test-user-uuid';

        const errors = await validate(dto);

        expect(errors.length).toBe(0);
    });

    it('fails validation when content is missing', async () => {
        const dto = new CreateTodoDto();
        dto.user_uuid = 'test-user-uuid';

        const errors = await validate(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]?.property).toBe('content');
    });

    it('fails validation when user_uuid is missing', async () => {
        const dto = new CreateTodoDto();
        dto.content = 'Test Todo';

        const errors = await validate(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]?.property).toBe('user_uuid');
    });

    it('fails validation when content is not a string', async () => {
        const dto = new CreateTodoDto();
        dto.content = 123 as any;
        dto.user_uuid = 'test-user-uuid';

        const errors = await validate(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]?.property).toBe('content');
    });

    it('fails validation when user_uuid is not a string', async () => {
        const dto = new CreateTodoDto();
        dto.content = 'Test Todo';
        dto.user_uuid = 123 as any;

        const errors = await validate(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]?.property).toBe('user_uuid');
    });
});

describe('UpdateTodoDto', () => {
    it('validates successfully with valid optional content', async () => {
        const dto = new UpdateTodoDto();
        dto.content = 'Updated Todo';

        const errors = await validate(dto);

        expect(errors.length).toBe(0);
    });

    it('validates successfully when content is not provided', async () => {
        const dto = new UpdateTodoDto();

        const errors = await validate(dto);

        expect(errors.length).toBe(0);
    });

    it('fails validation when content is not a string', async () => {
        const dto = new UpdateTodoDto();
        dto.content = 123 as any;

        const errors = await validate(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]?.property).toBe('content');
    });
});