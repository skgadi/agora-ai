import { notifyError, notifyInfo } from "../services/notifications/index.js";
import { joinMainRoom } from "../socket-rooms/main-room.js";

const mainAppSocketRoutines = async (io: any, socket: any) => {
  socket.on("app-init", async () => {
    try {
      console.log("app-init event received");
      // Subscribe to the main room
      joinMainRoom(socket);
      notifyInfo(
        socket,
        "Application initialized successfully",
        "Initialization"
      );
      // Perform any necessary initialization logic here
      socket.emit("app-init", { message: "Full app initialized" });
    } catch (error) {
      console.error("Error during app initialization:", error);
      notifyError(
        socket,
        "Failed to initialize the application. Please try again later.",
        "Initialization Error"
      );
    }
  });
};
export { mainAppSocketRoutines };
