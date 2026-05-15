import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getSessions,
  getSession,
  createSession,
  sendMessage,
  deleteSession,
} from '../controllers/chatController';

const router = Router();

router.use(requireAuth);

router.get('/', getSessions);
router.post('/', createSession);
router.get('/:id', getSession);
router.post('/:id/messages', sendMessage);
router.delete('/:id', deleteSession);

export default router;
