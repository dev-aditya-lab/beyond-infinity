import { Server } from "socket.io";
import { ENV } from "../config/env.config.js";

let io;

/**
 * Initialize Socket.IO Server
 */
export const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ENV.CORS_ORIGIN,
      credentials: true,
    },
    pingTimeout: 60000, // connection stability
  });

  console.log("🚀 Socket.IO server initialized");

  /**
   * Global connection handler
   */
  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    /**
     * Example: Join room
     */
    socket.on("join_room", (roomId) => {
      if (!roomId) return;

      socket.join(roomId);
      console.log(`📥 Socket ${socket.id} joined room ${roomId}`);
    });

    /**
     * Example: Leave room
     */
    socket.on("leave_room", (roomId) => {
      socket.leave(roomId);
      console.log(`📤 Socket ${socket.id} left room ${roomId}`);
    });

    /**
     * Example: Message event
     */
    socket.on("send_message", ({ roomId, message }) => {
      if (!roomId || !message) return;

      io.to(roomId).emit("receive_message", {
        message,
        sender: socket.id,
        timestamp: new Date(),
      });
    });

    /**
     * Disconnect event
     */
    socket.on("disconnect", (reason) => {
      console.log(`⚠️ Socket disconnected: ${socket.id} | ${reason}`);
    });

    /**
     * Error handling
     */
    socket.on("error", (err) => {
      console.error(`❌ Socket error (${socket.id}):`, err.message);
    });
  });
};

/**
 * Get IO instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};
