require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { notFound, errorHandler } = require("./Src/Middleware/errorMiddleware");
const connectToDb = require("./Src/Config/Db");
const chatRouter = require("./Src/Routes/chatRoutes");
const UserRouter = require("./Src/Routes/userRoutes");
const messageRouter = require("./Src/Routes/messageRouter");
const User = require("./Src/Model/userModel");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

connectToDb();

app.use("/api/user", UserRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);

  socket.on("setup", async (userId) => {
    socket.join(userId);
    socket.data.userId = userId;
    await User.findByIdAndUpdate(userId, { isOnline: true });
    io.emit("user online", { userId });
    socket.emit("connected");
  });

  socket.on("join chat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("leave chat", (chatId) => {
    socket.leave(chatId);
  });

  socket.on("new message", (messageData) => {
    const chat = messageData?.chat;
    if (!chat?.users) return;

    const senderId = messageData.sender?._id?.toString(); // ← CHANGE 1: moved outside loop

    chat.users.forEach((user) => {
      const userId = typeof user === "object" ? user._id?.toString() : user?.toString();
      if (userId === senderId) return;

      socket.to(chat._id).emit("message received", messageData);
      socket.to(userId).emit("notification received", messageData);
    });

    // ← CHANGE 2: emit "message delivered" ONCE to sender after loop
    // not inside loop — avoids duplicate delivered events per recipient
    socket.to(senderId).emit("message delivered", {
      messageId: messageData._id,
      chatId: chat._id,
    });
  });

  socket.on("typing", ({ chatId, username }) => {
    socket.to(chatId).emit("typing", { chatId, username });
  });

  socket.on("stop typing", ({ chatId }) => {
    socket.to(chatId).emit("stop typing", { chatId });
  });

  // ← CHANGE 3: new event — client emits after markAsRead REST call
  // server forwards "messages read" to everyone else in the chat room
  socket.on("mark read", ({ chatId, userId }) => {
    socket.to(chatId).emit("messages read", { chatId, userId });
  });

  // ── message deleted — broadcast to chat room ──
socket.on("message deleted", ({ message, chatId }) => {
  socket.to(chatId).emit("message deleted", message);
});

// ── message edited — broadcast to chat room ──
socket.on("message edited", ({ message, chatId }) => {
  socket.to(chatId).emit("message edited", message);
});

  socket.on("disconnect", async () => {
    console.log("Disconnected:", socket.id);
    const userId = socket.data.userId;
    if (!userId) return;
    const lastSeen = new Date();
    await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen });
    io.emit("user offline", { userId, lastSeen });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Running on port ${PORT}`));