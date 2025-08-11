import { validate } from 'class-validator';
        import { RegisterUserDto } from '../validations/user.validation';

        describe('RegisterUserDto', () => {
            it('should pass validation with valid email and password', async () => {
                const dto = new RegisterUserDto();
                dto.user_email = 'test@example.com';
                dto.user_pwd = 'password123';

                const errors = await validate(dto);
                expect(errors.length).toBe(0);
            });

            it('should fail validation with invalid email', async () => {
                const dto = new RegisterUserDto();
                dto.user_email = 'invalid-email';
                dto.user_pwd = 'password123';

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                if (errors.length > 0) {
                    expect(errors[0]?.property).toBe('user_email');
                }
            });

            it('should fail validation with short password', async () => {
                const dto = new RegisterUserDto();
                dto.user_email = 'test@example.com';
                dto.user_pwd = '123';

                const errors = await validate(dto);
                expect(errors.length).toBeGreaterThan(0);
                if (errors.length > 0) {
                    expect(errors[0]?.property).toBe('user_pwd');
                }
            });
        });