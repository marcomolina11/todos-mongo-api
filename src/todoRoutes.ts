import { Router } from 'express';
import todoController from './todoController'

const router = Router()

router.get('/', todoController.getTodos);
router.post('/', todoController.addTodo);
router.patch('/:id', todoController.patchTodo);
router.delete('/:id', todoController.deleteTodo);

export default router;