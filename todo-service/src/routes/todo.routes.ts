import { Router } from 'express';
import TodoController from '../controllers/todo.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Create a new todo (protected)
router.post('/', authenticateJWT, TodoController.create);

// Get all todos (protected)
router.get('/', authenticateJWT, TodoController.getAll);

// Update a todo by ID (protected)
router.put('/:id', authenticateJWT, TodoController.update);

// Delete a todo by ID (protected)
router.delete('/:id', authenticateJWT, TodoController.delete);

export default router;