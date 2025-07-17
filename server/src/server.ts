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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/config", (req, res) => {
  // Determine the Socket.IO server URL dynamically.
  //
  // Use `req.headers.host` to get the host and port the client is connecting to.
  // This is the most reliable way when running behind proxies or in Docker,
  // as it reflects the external URL.
  //
  // If `req.headers.host` is not available (e.g., direct access and not properly
  // set by a proxy), you might fall back to a predefined environment variable
  // or a default.
  //
  // Ensure you use 'https' if your production environment uses SSL.
  const protocol =
    req.protocol ||
    (req.headers["x-forwarded-proto"] === "https" ? "wss" : "ws");
  const socketServerUrl = `${protocol}://${req.headers.host}`;

  // Log for debugging
  console.log(
    `Frontend is requesting config. Detected Socket.IO URL: ${socketServerUrl}`
  );

  res.json({
    socketServerUrl: socketServerUrl,
  });
});

app.get("/{*any}", (req, res) => {
  // Changed '{*any}' to '/*' for broader compatibility
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

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
