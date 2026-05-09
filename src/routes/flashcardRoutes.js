import express from 'express';
import {
    getCardById,
    getCardsByConteudoAndDisciplinaAndLimite,
    getCardsByIdDeckOrderByDificuldade,
    getCardsByIdDeck,
    createCard,
    editCard,
    deleteCard,
    reviewCard
} from '../controllers/flashcardController.js';

import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// http://localhost:3000/flashcards/view/:id
router.get('/view/:id', requireAuth, getCardById);

// http://localhost:3000/flashcards/filtro
router.get('/filtro', requireAuth, getCardsByConteudoAndDisciplinaAndLimite);

// http://localhost:3000/flashcards/deck/:deckId/dificuldade
router.get('/deck/:deckId/dificuldade', requireAuth, getCardsByIdDeckOrderByDificuldade);

// http://localhost:3000/flashcards/deck/:deckId
router.get('/deck/:deckId', requireAuth, getCardsByIdDeck);

// http://localhost:3000/flashcards/create
router.post('/create', requireAuth, createCard);

// http://localhost:3000/flashcards/update/:id
router.patch('/update/:id', requireAuth, editCard);

// http://localhost:3000/flashcards/delete/:id
router.delete('/delete/:id', requireAuth, deleteCard);

// http://localhost:3000/flashcards/review/:id
router.put('/review/:id', requireAuth, reviewCard);

export default router;