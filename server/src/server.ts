import { httpServer } from './app';

const rawPort = process.env.PORT;
const parsedPort = rawPort && /^\d+$/.test(rawPort) ? Number(rawPort) : 5000;

httpServer.listen(parsedPort, () => {
  console.log(`Messenger server is running on http://localhost:${parsedPort}`);
});