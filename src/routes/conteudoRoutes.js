import express from 'express';
import {
    getAllConteudosByDisciplina,
    getConteudoById,
    createConteudo,
    updateConteudo,
    deleteConteudo
} from '../controllers/conteudoController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();
// http://localhost:3000/conteudos/disciplina/:disciplinaId
router.get('/disciplina/:disciplinaId', requireAuth, getAllConteudosByDisciplina);

// http://localhost:3000/conteudos/getById/:id
router.get('/getById/:id', requireAuth, getConteudoById);

// http://localhost:3000/conteudos/create
router.post('/create', requireAuth, createConteudo);

// http://localhost:3000/conteudos/update/:id
router.patch('/update/:id', requireAuth, updateConteudo);

// http://localhost:3000/conteudos/delete/:id
router.delete('/delete/:id', requireAuth, deleteConteudo);

export default router;