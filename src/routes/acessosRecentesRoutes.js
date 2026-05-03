import express from 'express';
import { listarAcessos } from '../controllers/AcessosRecentesController.js';

const router = express.Router();

router.get('/', listarAcessos);

export default router;