import express from 'express';
import {
    getPerguntasByAvaliacao, 
    getPerguntasByFiltro, 
    createPergunta, 
    updatePergunta, 
    deletePergunta,
    getAllPerguntas, 
    responderPergunta, 
    createAlternativa, 
    updateAlternativa, 
    deleteAlternativa
} from '../controllers/perguntaController.js';


const router = express.Router();

// http://localhost:3000/perguntas/getAll
router.get('/getAll', getAllPerguntas);

// http://localhost:3000/perguntas/filtro
router.get('/filtro', getPerguntasByFiltro);

// http://localhost:3000/perguntas/avaliacao/:id
router.get('/avaliacao/:avaliacaoId', getPerguntasByAvaliacao);

// http://localhost:3000/perguntas/create
router.post('/create', createPergunta);

// http://localhost:3000/perguntas/responder
router.post('/responder', responderPergunta);

// http://localhost:3000/perguntas/alternativa
router.post('/alternativa', createAlternativa);

// http://localhost:3000/perguntas/update/:id
router.patch('/update/:id', updatePergunta);

//  http://localhost:3000/perguntas/alternativa/update/:id
router.patch('/alternativa/update/:id', updateAlternativa);

// http://localhost:3000/perguntas/delete/:id
router.delete('/delete/:id', deletePergunta);

//  http://localhost:3000/perguntas/alternativa/delete/:id
router.delete('/alternativa/delete/:id', deleteAlternativa);

export default router;