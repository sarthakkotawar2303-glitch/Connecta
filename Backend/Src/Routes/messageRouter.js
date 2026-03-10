const express = require("express");
const {
  sendMessage, allMessages, markAsRead,
  getUnreadCounts,
  deleteMessage,
  editMessage,
} = require("../Controller/message-Controller");
const auth = require("../Middleware/authMiddleware");

const messageRouter = express.Router();

messageRouter.get("/unread/counts", auth, getUnreadCounts)
messageRouter.post("/", auth, sendMessage)
messageRouter.put("/read/:chatId", auth, markAsRead)   // FIX 10: was missing entirely!
messageRouter.get("/:chatId", auth, allMessages)
messageRouter.delete("/:messageId", auth, deleteMessage) // FIX 11: was mapped to editMsg
messageRouter.put("/:messageId", auth, editMessage)      // FIX 11: was mapped to deleteMsg

module.exports = messageRouter;