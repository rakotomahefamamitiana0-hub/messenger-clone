import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { validateLogin, validateRegister } from '../utils/validation';

const router = Router();

router.post('/login', (req, res, next) => {
  const { isValid, errors } = validateLogin(req.body as { email?: string; password?: string });
  if (!isValid) return res.status(400).json({ message: 'Validation failed', errors });
  return next();
}, login);

router.post('/register', (req, res, next) => {
  const { isValid, errors } = validateRegister(req.body as { username?: string; email?: string; password?: string });
  if (!isValid) return res.status(400).json({ message: 'Validation failed', errors });
  return next();
}, register);

export default router;