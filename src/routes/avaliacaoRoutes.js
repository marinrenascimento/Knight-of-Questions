import express from 'express';
import {
    getAvaliacaoById,
    getAllAvaliacoesByUser,
    getAllAvaliacoesVestibulares,
    createAvaliacao,
    updateInfoDeck,
    deleteDeckAndFlashcards,
    savePeriodoReview,
    startAvaliacao,
    finishAvaliacao,
    getResultadoAvaliacao,
    getAnotacoesByAvaliacao
} from '../controllers/avaliacaoController.js';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// http://localhost:3000/avaliacoes/user/:id
router.get('/user/:userId', requireAuth, requireRole('estudante'), getAllAvaliacoesByUser);

// http://localhost:3000/avaliacoes/vestibular/all
router.get('/vestibular/all', requireAuth, requireRole('estudante'), getAllAvaliacoesVestibulares);

// http://localhost:3000/avaliacoes/:id
router.get('/:id', requireAuth, requireRole('estudante'), getAvaliacaoById);

// http://localhost:3000/avaliacoes/resultado/:reviewId
router.get('/resultado/:reviewId', requireAuth, requireRole('estudante'), getResultadoAvaliacao);

// http://localhost:3000/avaliacoes/anotacoes/:reviewId
router.get('/anotacoes/:reviewId', requireAuth, requireRole('estudante'), getAnotacoesByAvaliacao);

// http://localhost:3000/avaliacoes/create
router.post('/create', requireAuth, requireRole('estudante'), createAvaliacao);

// http://localhost:3000/avaliacoes/periodo-review
router.post('/periodo-review', requireAuth, requireRole('estudante'), savePeriodoReview);

// http://localhost:3000/avaliacoes/start
router.post('/start', requireAuth, requireRole('estudante'), startAvaliacao);

// http://localhost:3000/avaliacoes/finish
router.post('/finish', requireAuth, requireRole('estudante'), finishAvaliacao);

// http://localhost:3000/avaliacoes/update/1
router.patch('/update/:id', requireAuth, requireRole('estudante'), updateInfoDeck);

// http://localhost:3000/avaliacoes/delete/:id
router.delete('/delete/:id', requireAuth, requireRole('estudante'), deleteDeckAndFlashcards);

export default router;