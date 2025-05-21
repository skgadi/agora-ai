import express from "express";
import http from "http";
import { Server } from "socket.io";

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files if needed
app.use(express.static("public"));

import { initialize as initMainRoom } from "./socket-rooms/main-room";
initMainRoom(io);

import { mainAppSocketRoutines } from "./socket/app-main";
import { adminActivitiesSocketRoutines } from "./socket/admin-acitivites";

// Socket.IO connection handling
io.on("connection", (socket) => {
  mainAppSocketRoutines(io, socket);
  adminActivitiesSocketRoutines(io, socket);

  // Example of handling a custom event
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3100; // Should be same as in client `services/socket/index.ts`

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
