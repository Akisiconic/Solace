import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getLogs, createLog, deleteLog } from '../controllers/moodController';

const router = Router();

router.use(requireAuth);

router.get('/', getLogs);
router.post('/', createLog);
router.delete('/:id', deleteLog);

export default router;
