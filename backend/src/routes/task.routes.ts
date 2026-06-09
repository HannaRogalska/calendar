import { Router } from 'express';
import { createTask, getAllTasks, changeTask, deleteTask, changeTaskDate } from '../controllers/task.controller';

const router = Router();

router.get('/', getAllTasks);
router.post('/', createTask);
router.patch('/changed/:id', changeTask);
router.patch('/:id', changeTaskDate);
router.delete('/:id', deleteTask);

export default router;
