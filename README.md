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

This app is ready to be deployed as a demo on a Node host such as Render or Railway for the backend, and Vercel or Netlify for the frontend.

Set these variables in production:
- VITE_API_URL=https://your-backend-url
- CLIENT_URL=https://your-frontend-url
- PORT=5000
- JWT_SECRET=your-secure-secret

## Demo usage

1. Open the frontend in a browser.
2. Create an account or log in.
3. Join a room.
4. Send messages in real time.

## Notes

This is a working Messenger-style prototype for local/demo use. It is intentionally simple and can be extended with a persistent database and real user storage later.

If you restart the server, saved demo data will be lost because the app uses in-memory storage for now.
