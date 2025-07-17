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

// --- CORRECTED WAY TO GET __dirname EQUIVALENT IN ES MODULES ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- END CORRECTED WAY ---

// Serve static files from the 'public' directory
// __dirname will now correctly resolve to the directory where server.ts is located
// In your development environment, this is `/home/sigrama-admin/git/pai/server/src`
// In your Docker build (after compilation and copying), this will be `/app/dist`
app.use(express.static(path.join(__dirname, "..", "public")));

// --- ADD THIS CRUCIAL SECTION ---
// IMPORTANT: This is the crucial part for Quasar's history mode routing.
// It serves your main index.html for any client-side routes (like /admin)
// that are not explicit API routes or other server-defined routes.
// This MUST be placed AFTER all other app.use() and app.get() for your API routes.

console.log("Serving static files from:", path.join(__dirname, "..", "public"));
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
// --- END OF CRUCIAL SECTION ---

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
