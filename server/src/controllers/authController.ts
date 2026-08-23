import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const users: Array<{ id: string; username: string; email: string; password: string }> = [];

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body as { username?: string; email?: string; password?: string };

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  const existing = users.find((user) => user.username === username || user.email === email);
  if (existing) {
    return res.status(409).json({ message: 'Utilisateur ou email déjà existant.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now().toString(),
    username,
    email,
    password: passwordHash,
  };

  users.push(user);

  return res.status(201).json({
    message: 'Compte créé avec succès.',
    user: { id: user.id, username: user.username, email: user.email },
  });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    return res.status(400).json({ message: 'Nom d’utilisateur et mot de passe requis.' });
  }

  const user = users.find((item) => item.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Identifiants invalides.' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Identifiants invalides.' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '24h' });

  return res.status(200).json({
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
};

export default { register, login };