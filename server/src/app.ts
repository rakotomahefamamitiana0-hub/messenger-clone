import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
const allowedOrigins = [
  clientOrigin,
  'https://messenger-clone-kohl-phi.vercel.app',
  'https://messenger-clone-ekpg.vercel.app',
];
const corsOrigin = (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
  callback(null, !origin || allowedOrigins.includes(origin));
};

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'],
  },
});

const users: Array<{ id: string; username: string; email: string; password: string }> = [];
const messages: Array<{ id: string; sender: string; text: string; room: string; time: string }> = [];

app.use(cors({ origin: corsOrigin, credentials: true }));
app.options('*', cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'Messenger backend is running' });
});

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  const existing = users.find((user) => user.username === username || user.email === email);
  if (existing) {
    return res.status(409).json({ message: 'Utilisateur ou email déjà existant.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now().toString(),
    username,
    email,
    password: hashedPassword,
  };

  users.push(user);

  res.status(201).json({
    message: 'Compte créé',
    user: { id: user.id, username: user.username, email: user.email },
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((item) => item.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Identifiants invalides.' });
  }

  const passwordOk = await bcrypt.compare(password, user.password);
  if (!passwordOk) {
    return res.status(401).json({ message: 'Identifiants invalides.' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '24h' });

  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
});

app.get('/api/users', (_req, res) => {
  res.json(users.map(({ id, username, email }) => ({ id, username, email })));
});

app.get('/api/messages', (_req, res) => {
  res.json(messages);
});

io.on('connection', (socket) => {
  socket.on('join-room', (room: string) => {
    socket.join(room);
  });

  socket.on('send-message', (payload: { id?: string; sender: string; text: string; room: string; time?: string }) => {
    const message = {
      id: payload.id || Date.now().toString(),
      sender: payload.sender,
      text: payload.text,
      room: payload.room,
      time: payload.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    messages.push(message);
    io.to(payload.room).emit('room-message', message);
  });
});

export { app, httpServer, io };