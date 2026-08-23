import { Server } from "socket.io";
import { createServer } from "http";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on("sendMessage", (message) => {
        const { room, content } = message;
        io.to(room).emit("receiveMessage", content);
        console.log(`Message sent to room ${room}: ${content}`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected: " + socket.id);
    });
});

export default httpServer;