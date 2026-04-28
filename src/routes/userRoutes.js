import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/userController.js';

import { requireAuth, requirePermission, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Definindo as rotas
router.get('/', requireAuth, requirePermission('users:read'), getAllUsers);
router.get('/:id', requireAuth, getUserById);
router.put('/:id', requireAuth, requirePermission('users:update'), updateUser);
router.delete('/:id', requireAuth, requireRole('admin'), deleteUser);

export default router;