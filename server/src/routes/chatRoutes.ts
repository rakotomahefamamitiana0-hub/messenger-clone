import { Router } from 'express';
import { getChatConversations, sendMessage, getMessages } from '../controllers/chatController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.get('/conversations', authMiddleware, getChatConversations);
router.post('/messages', authMiddleware, sendMessage);
router.get('/messages/:conversationId', authMiddleware, getMessages);

export default router;