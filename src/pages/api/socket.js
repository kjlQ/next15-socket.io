import { Server } from "socket.io";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Starting socket.io server...");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    const rooms = [];

    io.on("connection", (socket) => {
      console.log("User connected", socket.id);

      socket.on("joinRoom", (room) => {
        socket.join(room);
        if (!rooms.includes(room)) {
          rooms.push(room);
          console.log(room);
        }
      });

      socket.on("message", ({ room, message }) => {
        io.to(room).emit("message", message);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
      });
    });
  }
  res.end();
}
