import { joinMainRoom } from "../socket-rooms/main-room.js";

const mainAppSocketRoutines = async (io: any, socket: any) => {
  socket.on("app-init", async () => {
    console.log("app-init event received");
    // Subscribe to the main room
    joinMainRoom(socket);
    // Perform any necessary initialization logic here
    socket.emit("app-init", { message: "Full app initialized" });
  });
};
export { mainAppSocketRoutines };
