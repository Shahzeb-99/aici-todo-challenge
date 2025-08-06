import {Router} from 'express';
import UserController from '../controllers/user.controller';

/**
 * Defines the routes for user-related operations.
 * Includes routes for user registration and login.
 */
const router = Router();

/**
 * Route to handle user registration.
 * Delegates the request to the `register` method of `UserController`.
 */
router.post('/register', UserController.register);

/**
 * Route to handle user login.
 * Delegates the request to the `login` method of `UserController`.
 */
router.post('/login', UserController.login);

export default router;