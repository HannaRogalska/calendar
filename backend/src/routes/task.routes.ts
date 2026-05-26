import { Router } from 'express';
import { createTask, getAllTasks, changeTask, deleteTask } from '../controllers/task.controller';

const router = Router();

router.get('/', getAllTasks);
router.post('/', createTask);
router.patch('/:id', changeTask);
router.delete('/:id', deleteTask);

export default router;
