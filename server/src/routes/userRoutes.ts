import { Router } from 'express';
import { getUserProfile, updateUserProfile, deleteUserAccount } from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.delete('/account', authMiddleware, deleteUserAccount);

export default router;