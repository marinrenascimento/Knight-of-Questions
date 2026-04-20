import express from 'express';
import {
  getAllAvatares,
  getAvataresDisponiveis,
  getAvatarSelecionado
} from '../controllers/avatarController.js';

const router = express.Router();

router.get('/', getAllAvatares);
router.get('/disponiveis', getAvataresDisponiveis);
router.get('/selecionado', getAvatarSelecionado);

export default router;
