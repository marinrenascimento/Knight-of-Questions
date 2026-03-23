import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getPostsByUserId,
    createPostByUserId
} from '../controllers/userController.js';

const router = express.Router();

// Definindo as rotas
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id/posts', getPostsByUserId); // 1 -> N
router.post('/:id/posts', createPostByUserId); // 1 -> N

export default router;