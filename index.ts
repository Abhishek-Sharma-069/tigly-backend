import { createServer } from "http";
import { Server } from "socket.io";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());

// create HTTP server with the express app so Socket.IO can attach to it
const httpServer = createServer(app);
const io = new Server(httpServer, {
  // socket.io options if needed
});

io.on("connection", (socket) => {
  console.log("user connected");
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});