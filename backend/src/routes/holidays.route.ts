import { Router } from 'express';
import { getHolidays } from '../controllers/nager.controller';

const router = Router();

router.get('/PublicHolidays', getHolidays);

export default router;
