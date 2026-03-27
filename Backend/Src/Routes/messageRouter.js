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
messageRouter.put("/read/:chatId", auth, markAsRead)   
messageRouter.get("/:chatId", auth, allMessages)
messageRouter.delete("/:messageId", auth, deleteMessage) 
messageRouter.put("/:messageId", auth, editMessage)      

module.exports = messageRouter;