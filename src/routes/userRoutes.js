import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/userController.js';

import { requireAuth, requirePermission, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/list', requireAuth, requirePermission('users:read'), getAllUsers);
router.get('/view/:id', requireAuth, requirePermission('users:read'), getUserById);
router.put('/update/:id', requireAuth, updateUser);
router.delete('/delete/:id', requireAuth, requireRole('admin'), deleteUser);

export default router;