import express from 'express';
import {
    getAllConteudosByDisciplina, 
    getConteudoById, 
    createConteudo, 
    updateConteudo, 
    deleteConteudo
} from '../controllers/conteudoController.js';


const router = express.Router();
// http://localhost:3000/conteudos/disciplina/:disciplinaId
router.get('/disciplina/:disciplinaId', getAllConteudosByDisciplina);

// http://localhost:3000/conteudos/getById/:id
router.get('/getById/:id', getConteudoById);

// http://localhost:3000/conteudos/create
router.post('/create', createConteudo);

// http://localhost:3000/conteudos/update/:id
router.patch('/update/:id', updateConteudo);

// http://localhost:3000/conteudos/delete/:id
router.delete('/delete/:id', deleteConteudo);

export default router;