import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { SocketHandler } from "./src/socket/socketHandler";
const socketHandler = new SocketHandler();
dotenv.config();
const app = express();
app.use(cors());

// create HTTP server with the express app so Socket.IO can attach to it
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
app.get("/", (req, res) => {
  res.send("Hello I'm Tigly backend");
});
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.emit("server_status", "Socket connected successfully");
socket.on("join_room", ({ name }) => {
  console.log("User joined room:", name);
  socketHandler.handleJoinRoom(socket, name);
  socket.emit("server_reply", `${name} joined room successfully`);
});
socket.on("leave_room", ({ name }) => {
  console.log("User left room:", name);
  socketHandler.handleLeaveRoom(socket, name);
  socket.emit("server_reply", `${name} left room successfully`);
});
socket.on("disconnect", () => {
  console.log("Socket disconnected:", socket.id);
  socketHandler.handleDisconnect(socket);
});
});

const PORT = process.env.PORT;
if (!PORT) {
  throw new Error("PORT is not set in the environment variables");
}
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
