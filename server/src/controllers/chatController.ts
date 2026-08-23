import { Request, Response } from 'express';

export const getChatConversations = async (_req: Request, res: Response) => {
  return res.status(200).json([
    { id: 'general', name: 'Général', members: ['general'] },
    { id: 'dev', name: 'Développement', members: ['dev'] },
    { id: 'team', name: 'Équipe', members: ['team'] },
  ]);
};

export const sendMessage = async (req: Request, res: Response) => {
  const { room, text } = req.body as { room?: string; text?: string };

  if (!text || !room) {
    return res.status(400).json({ message: 'Room et message requis.' });
  }

  const payload = {
    id: Date.now().toString(),
    sender: (req as Request & { user?: { username?: string } }).user?.username || 'user',
    text,
    room,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  return res.status(200).json(payload);
};

export const getMessages = async (_req: Request, res: Response) => {
  return res.status(200).json([
    { id: 'welcome', sender: 'System', text: 'Bienvenue dans le salon.', room: 'general', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);
};

export default { getChatConversations, sendMessage, getMessages };