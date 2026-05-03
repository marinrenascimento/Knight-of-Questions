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


const router = express.Router();

// http://localhost:3000/avaliacoes/user/:id
router.get('/user/:userId', getAllAvaliacoesByUser);

// http://localhost:3000/avaliacoes/vestibular/all
router.get('/vestibular/all', getAllAvaliacoesVestibulares);

// http://localhost:3000/avaliacoes/1
router.get('/:id', getAvaliacaoById);

// http://localhost:3000/avaliacoes/resultado/1
router.get('/resultado/:reviewId', getResultadoAvaliacao);

// http://localhost:3000/avaliacoes/anotacoes/3
router.get('/anotacoes/:reviewId', getAnotacoesByAvaliacao);

// http://localhost:3000/avaliacoes/create
router.post('/create', createAvaliacao);

http://localhost:3000/avaliacoes/periodo-review
router.post('/periodo-review', savePeriodoReview);

// http://localhost:3000/avaliacoes/start
router.post('/start', startAvaliacao);

// http://localhost:3000/avaliacoes/finish
router.post('/finish', finishAvaliacao);

// http://localhost:3000/avaliacoes/update/1
router.patch('/update/:id', updateInfoDeck);

// http://localhost:3000/avaliacoes/delete/:id
router.delete('/delete/:id', deleteDeckAndFlashcards);

export default router;