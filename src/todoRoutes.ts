import { Router } from 'express';
import todoController from './todoController'

const router = Router()

router.get('/', todoController.getTodos);
router.post('/', todoController.addTodo);
router.delete('/:id', todoController.deleteTodo);
router.patch('/:id', todoController.patchTodo);

export default router;