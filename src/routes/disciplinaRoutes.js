import express from 'express';
import {
    getAllDisciplinas, 
    getDisciplinaById, 
    createDisciplina, 
    updateDisciplina, 
    deleteDisciplina
} from '../controllers/disciplinaController.js';


const router = express.Router();

// http://localhost:3000/disciplinas/getAll
router.get('/getAll', getAllDisciplinas);

// http://localhost:3000/disciplinas/getByID/:id
router.get('/getByID/:id', getDisciplinaById);

// http://localhost:3000/disciplinas/create
router.post('/create', createDisciplina); 

// http://localhost:3000/disciplinas/update/:id
router.patch('/update/:id', updateDisciplina);

// http://localhost:3000/disciplinas/delete/:id
router.delete('/delete/:id', deleteDisciplina);

export default router;