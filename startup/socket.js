const { Server } = require("socket.io");

module.exports = function (server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    debug(socket.id());
    socket.on("disconnect", () => {
      debug("User disconnected");
    });
  });
  return io;
};
