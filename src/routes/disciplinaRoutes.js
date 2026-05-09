import express from 'express';
import {
    getAllDisciplinas,
    getDisciplinaById,
    createDisciplina,
    updateDisciplina,
    deleteDisciplina
} from '../controllers/disciplinaController.js';

import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// http://localhost:3000/disciplinas/getAll
router.get('/getAll', requireAuth, getAllDisciplinas);

// http://localhost:3000/disciplinas/getByID/:id
router.get('/getByID/:id', requireAuth, getDisciplinaById);

// http://localhost:3000/disciplinas/create
router.post('/create', requireAuth, createDisciplina);

// http://localhost:3000/disciplinas/update/:id
router.patch('/update/:id', requireAuth, updateDisciplina);

// http://localhost:3000/disciplinas/delete/:id
router.delete('/delete/:id', requireAuth, deleteDisciplina);

export default router;