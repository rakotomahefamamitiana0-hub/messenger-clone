import React, { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type User = {
  id: string;
  username: string;
  email: string;
};

type Message = {
  id: string;
  sender: string;
  text: string;
  room: string;
  time: string;
};

const STORAGE_KEY = 'messenger-clone-user';
const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';

const createId = () => Math.random().toString(36).slice(2, 10);

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [chatRoom, setChatRoom] = useState('general');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'System',
      text: 'Bienvenue dans votre clone Messenger.',
      room: 'general',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [status, setStatus] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const socketClient = io(API_BASE, { transports: ['websocket'] });
    setSocket(socketClient);

    socketClient.emit('join-room', chatRoom);

    socketClient.on('room-message', (payload: Message) => {
      setMessages((current) => [...current, payload]);
    });

    return () => {
      socketClient.disconnect();
    };
  }, [user, chatRoom]);

  const handleAuth = async () => {
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = mode === 'login' ? { username, password } : { username, email, password };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      if (mode === 'register') {
        setStatus('Compte créé avec succès. Connectez-vous maintenant.');
        setMode('login');
        return;
      }

      const currentUser: User = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
      };

      setUser(currentUser);
      setStatus('Connexion réussie.');
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      setStatus(message);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !user || !socket) return;

    const payload: Message = {
      id: createId(),
      sender: user.username,
      text: message.trim(),
      room: chatRoom,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socket.emit('send-message', payload);
    setMessages((current) => [...current, payload]);
    setMessage('');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    setStatus('Déconnecté.');
  };

  const roomUsers = useMemo(() => (user ? [user.username, 'Alice', 'Bob', 'Charlie'] : []), [user]);

  if (!user) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Messenger</h1>
            <div className="toggle">
              <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
                Inscription
              </button>
              <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
                Connexion
              </button>
            </div>
          </div>

          <label>
            Nom d’utilisateur
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Votre pseudo" />
          </label>

          {mode === 'register' && (
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemple@mail.com" />
            </label>
          )}

          <label>
            Mot de passe
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </label>

          {status && <p className="status">{status}</p>}

          <button className="primary" onClick={handleAuth}>
            {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <h2>Messenger</h2>
          <button className="ghost" onClick={handleLogout}>Déconnexion</button>
        </div>

        <div className="room-picker">
          <label>Salon</label>
          <select value={chatRoom} onChange={(event) => setChatRoom(event.target.value)}>
            <option value="general">Général</option>
            <option value="dev">Développement</option>
            <option value="team">Équipe</option>
          </select>
        </div>

        <div className="presence-box">
          <h3>En ligne</h3>
          <ul>
            {roomUsers.map((person) => (
              <li key={person}>{person}</li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="chat-area">
        <header className="chat-header">
          <div>
            <h3>#{chatRoom}</h3>
            <small>{user.username}</small>
          </div>
        </header>

        <div className="messages">
          {messages
            .filter((msg) => msg.room === chatRoom)
            .map((msg) => (
              <div key={msg.id} className={`bubble ${msg.sender === user.username ? 'mine' : ''}`}>
                <strong>{msg.sender}</strong>
                <p>{msg.text}</p>
                <span>{msg.time}</span>
              </div>
            ))}
        </div>

        <div className="composer">
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Écrivez un message..."
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSendMessage();
            }}
          />
          <button className="primary" onClick={handleSendMessage}>Envoyer</button>
        </div>
      </main>
    </div>
  );
}
