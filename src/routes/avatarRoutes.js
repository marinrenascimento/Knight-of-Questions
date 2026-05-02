import express from 'express';
import {
  getAllAvatares,
  getAvataresDisponiveisByUser,
  getAvatarSelecionado,
  selecionarAvatar
} from '../controllers/avatarController.js';

import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/list', requireAuth, getAllAvatares);
router.get('/disponiveis', requireAuth, requireRole('estudante', 'admin'), getAvataresDisponiveisByUser);
router.get('/selecionado', requireAuth, requireRole('estudante', 'admin'), getAvatarSelecionado);
router.put('/selecionar', requireAuth, requireRole('estudante', 'admin'), selecionarAvatar);

export default router;
