import { GSK_SEND_PASSWORD_TO_CLIENT } from "../services/library/types/data-transfer-protocls.js";
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

      // sending password to client
      const adminPassword = process.env.MY_PAI_ADMIN_PASSWORD || "123456";
      const payload: GSK_SEND_PASSWORD_TO_CLIENT = {
        type: "GSK_SEND_PASSWORD_TO_CLIENT",
        payload: {
          password: adminPassword,
        },
      };
      socket.emit("settings-admin-password", payload);

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
