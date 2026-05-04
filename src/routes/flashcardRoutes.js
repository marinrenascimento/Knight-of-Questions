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


const router = express.Router();

router.get('/view/:id', getCardById);

// http://localhost:3000/flashcards/filtro
router.get('/filtro', getCardsByConteudoAndDisciplinaAndLimite);

// http://localhost:3000/flashcards/deck/:deckId/dificuldade
router.get('/deck/:deckId/dificuldade', getCardsByIdDeckOrderByDificuldade);

// http://localhost:3000/flashcards/deck/:deckId
router.get('/deck/:deckId', getCardsByIdDeck);

// http://localhost:3000/flashcards/create
router.post('/create', createCard);

// http://localhost:3000/flashcards/update/:id
router.patch('/update/:id', editCard);

// http://localhost:3000/flashcards/delete/:id
// Não tem a tabela flashCard Reviews, nem no documento do drive
router.delete('/delete/:id', deleteCard);

// http://localhost:3000/flashcards/review/:id
router.put('/review/:id', reviewCard);

export default router;