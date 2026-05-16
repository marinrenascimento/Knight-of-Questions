import express from 'express';
import sessaoController from '../controllers/sessaoController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/start', requireAuth, sessaoController.startSessao);
router.put('/end/:id', requireAuth, sessaoController.endSessao);
router.get('/tempo/:user_id', requireAuth, sessaoController.getTempoTotalSessoes);

export default router;