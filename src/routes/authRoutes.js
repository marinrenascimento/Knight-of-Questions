import express from 'express';
import { login, register, logout, updatePassword } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.post('/update-password', requireAuth, updatePassword);

export default router;
