import express from 'express';
import { getPostById } from '../controllers/postController.js';

const router = express.Router();

// GET /posts/:id - Retorna post incluindo autor (N -> 1)
router.get('/:id', getPostById);

export default router;