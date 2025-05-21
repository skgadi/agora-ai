let io: any;

export const initialize = (inIO: any) => {
  io = inIO;
};

export const joinMainRoom = async (socket: any) => {
  await socket.join("main-room");
  emitText(socket);
};
export const emitText = async (socket: any) => {
  io.to("main-room").emit("main-room-text", {
    text: "Welcome to the main room!",
  });
};
