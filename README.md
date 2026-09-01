# Messenger Clone

A lightweight Messenger-style demo built with React + Vite on the frontend and Node.js + Express + Socket.IO on the backend.

## Important note

This project is a functional demo application, not yet a production-grade chat platform with persistent storage.

Users, messages, and room data are kept in memory while the backend is running. If the server restarts, the data is reset. For a durable production version, a real database such as SQLite, PostgreSQL, or MongoDB should be added.

## Features

- Registration and login
- Real-time room chat
- Online presence list
- Responsive UI
- Local demo-ready auth and message flow

## Project structure

- client/ — frontend React app
- server/ — Express + Socket.IO backend
- .env.example — default environment variables

## Local setup

1. Install root dependencies:
   npm install

2. Install client dependencies:
   npm --prefix client install

3. Install server dependencies:
   npm --prefix server install

4. Create the local environment files:
   copy .env.example .env
   copy server/.env.example server/.env

5. Start the app:
   npm run dev

Frontend URL:
- http://localhost:3000

Backend URL:
- http://localhost:5000

## Production build

Run the following command from the project root:

npm run build

## Deployment

### Backend (Render)

1. Push to GitHub (already done)
2. Create a new Web Service on Render
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   PORT=5000
   JWT_SECRET=your-very-secure-random-string-here
   CLIENT_URL=https://your-vercel-frontend-url
   ```
6. Deploy

**After Render deploys**, copy your backend URL (e.g., `https://messenger-clone-backend.onrender.com`)

### Frontend (Vercel)

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New" → "Project"
3. Import your `messenger-clone` repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables (BEFORE deploying):
   ```
   VITE_API_URL=https://messenger-clone-backend.onrender.com
   ```
   (Replace with your actual Render backend URL)
6. Click "Deploy"

**After Vercel deploys**, copy your frontend URL (e.g., `https://messenger-clone.vercel.app`)

### Final Step: Update Render Backend

1. Go back to Render dashboard
2. Open your backend service
3. Edit Environment Variables
4. Update `CLIENT_URL` to your Vercel URL:
   ```
   CLIENT_URL=https://messenger-clone.vercel.app
   ```
5. Click "Deploy" to restart the service

---

## Environment Variables Summary

| Variable | Where | Value | Example |
|----------|-------|-------|---------|
| `VITE_API_URL` | Vercel (Frontend) | Your Render backend URL | `https://messenger-clone-backend.onrender.com` |
| `PORT` | Render (Backend) | Always `5000` | `5000` |
| `JWT_SECRET` | Render (Backend) | Any strong random string | `your-secure-random-secret` |
| `CLIENT_URL` | Render (Backend) | Your Vercel frontend URL | `https://messenger-clone.vercel.app` |

## Demo usage

1. Open the frontend in a browser.
2. Create an account or log in.
3. Join a room.
4. Send messages in real time.

## Notes

This is a working Messenger-style prototype for local/demo use. It is intentionally simple and can be extended with a persistent database and real user storage later.

If you restart the server, saved demo data will be lost because the app uses in-memory storage for now.
