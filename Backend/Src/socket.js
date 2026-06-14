/**
 * @fileoverview Socket.io real-time event handlers and initialization.
 * @module Src/socket
 * @requires socket.io
 * @requires models/User
 */

const { Server } = require("socket.io");
const User = require("./Model/userModel");

/**
 * Initializes Socket.io server and registers event handlers.
 * 
 * @param {import('http').Server} server - The HTTP server instance.
 * @returns {Server} The initialized Socket.io Server instance.
 */
const initSocket = (server) => {
  const clientOrigin = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : "";
  const io = new Server(server, {
    cors: { origin: clientOrigin, credentials: true },
    pingTimeout: 60000,
  });

  io.on("connection", (socket) => {
    /**
     * Setup event to establish user session.
     * Joins user-specific room and broadcasts online status.
     */
    socket.on("setup", async (userId) => {
      socket.join(userId);
      socket.data.userId = userId;
      await User.findByIdAndUpdate(userId, { isOnline: true });
      io.emit("user online", { userId });
      socket.emit("connected");
    });

    /**
     * Joins a specific chat room.
     */
    socket.on("join chat", (chatId) => {
      socket.join(chatId);
    });

    /**
     * Leaves a specific chat room.
     */
    socket.on("leave chat", (chatId) => {
      socket.leave(chatId);
    });

    /**
     * Broadcasts a new message and delivery notification to recipients.
     */
    socket.on("new message", (messageData) => {
      const chat = messageData?.chat;
      if (!chat?.users) return;

      const senderId = messageData.sender?._id?.toString();

      chat.users.forEach((user) => {
        const userId = typeof user === "object" ? user._id?.toString() : user?.toString();
        if (userId === senderId) return;

        socket.to(chat._id).emit("message received", messageData);
        socket.to(userId).emit("notification received", messageData);
      });

      socket.to(senderId).emit("message delivered", {
        messageId: messageData._id,
        chatId: chat._id,
      });
    });

    /**
     * Broadcasts typing status to active chat participants.
     */
    socket.on("typing", ({ chatId, username }) => {
      socket.to(chatId).emit("typing", { chatId, username });
    });

    /**
     * Broadcasts typing stop status to active chat participants.
     */
    socket.on("stop typing", ({ chatId }) => {
      socket.to(chatId).emit("stop typing", { chatId });
    });

    /**
     * Broadcasts mark-read acknowledgement to chat participants.
     */
    socket.on("mark read", ({ chatId, userId }) => {
      socket.to(chatId).emit("messages read", { chatId, userId });
    });

    /**
     * Broadcasts message deletion event to chat participants.
     */
    socket.on("message deleted", ({ message, chatId }) => {
      socket.to(chatId).emit("message deleted", message);
    });

    /**
     * Broadcasts message modification event to chat participants.
     */
    socket.on("message edited", ({ message, chatId }) => {
      socket.to(chatId).emit("message edited", message);
    });

    /**
     * Handles connection termination. Sets online status to false and updates lastSeen.
     */
    socket.on("disconnect", async () => {
      const userId = socket.data.userId;
      if (!userId) return;
      const lastSeen = new Date();
      await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen });
      io.emit("user offline", { userId, lastSeen });
    });
  });

  return io;
};

module.exports = initSocket;
