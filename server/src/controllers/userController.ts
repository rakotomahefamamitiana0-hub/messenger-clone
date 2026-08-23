import { Request, Response } from 'express';

export const getUserProfile = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: { id?: string; username?: string; email?: string } }).user;

  return res.status(200).json({
    id: user?.id || 'demo-user',
    username: user?.username || 'demo-user',
    email: user?.email || 'demo@local.test',
  });
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: { id?: string; username?: string; email?: string } }).user;
  const { username, email } = req.body as { username?: string; email?: string };

  return res.status(200).json({
    id: user?.id || 'demo-user',
    username: username || user?.username || 'demo-user',
    email: email || user?.email || 'demo@local.test',
  });
};

export const deleteUserAccount = async (_req: Request, res: Response) => {
  return res.status(200).json({ message: 'Compte supprimé localement.' });
};

export default { getUserProfile, updateUserProfile, deleteUserAccount };