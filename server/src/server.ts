import express from "express";
import http from "http";
import { Server } from "socket.io";

import path from "path"; // <-- Import the path module
import { fileURLToPath } from "url"; // <-- Import fileURLToPath for ES Modules

import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 1e9, // 1 GB
});

// --- Start of Changes for Static File Serving ---

// Resolve __dirname equivalent for ES Modules
// This will give you the directory of the current module file (server.js)
// In your Docker setup, this will resolve to /app/dist
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correctly serve static files from the 'public' directory
// Your server.js is in /app/dist
// Your client-side assets are in /app/public
// So, from /app/dist, you need to go up one level (to /app) and then into 'public'
app.use(express.static(path.join(__dirname, "..", "public")));

// IMPORTANT: This is the crucial part for Quasar's history mode routing.
// It serves your main index.html for any client-side routes (like /admin)
// that are not explicit API routes or static files.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// --- End of Changes for Static File Serving ---

import { initialize as initMainRoom } from "./socket-rooms/main-room.js";
initMainRoom(io);

import { mainAppSocketRoutines } from "./socket/app-main.js";
import { adminActivitiesSocketRoutines } from "./socket/admin-acitivites.js";
import { clearTemporaryFiles } from "./clean-up-tmp.js";
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

const PORT = 3000; // Should be same as in client `services/socket/index.ts`

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log("Server file is running");

// Call the function immediately when the script starts
console.log("Performing initial temporary file cleanup on server start...");
clearTemporaryFiles();
