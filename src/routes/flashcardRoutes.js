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
} from '../controllers/flashcardController.js'; // Atenção ao nome do seu arquivo controller


const router = express.Router();

// http://localhost:3000/flashcards/filtro
router.get('/filtro', getCardsByConteudoAndDisciplinaAndLimite);

// http://localhost:3000/flashcards/deck/:deckId/dificuldade
router.get('/deck/:deckId/dificuldade', getCardsByIdDeckOrderByDificuldade);

// http://localhost:3000/flashcards/deck/:deckId
router.get('/deck/:deckId', getCardsByIdDeck);

// http://localhost:3000/flashcards/getById/:id
router.get('/getById/:id', getCardById);

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