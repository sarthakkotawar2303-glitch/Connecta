const express = require("express");
const {
  sendMessage, allMessages, markAsRead,
  getUnreadCounts,
  deleteMessage,
  editMessage,
} = require("../Controller/message-Controller");
const auth = require("../Middleware/authMiddleware");

const messageRouter = express.Router();

/**
 * @route GET /api/message/unread/counts
 * @desc Retrieves the unread message counts for all active chats of the logged-in user
 * @access Private (Requires Bearer Token)
 */
messageRouter.get("/unread/counts", auth, getUnreadCounts)

/**
 * @route POST /api/message
 * @desc Sends a new message to a specific chat room
 * @access Private (Requires Bearer Token)
 */
messageRouter.post("/", auth, sendMessage)

/**
 * @route PUT /api/message/read/:chatId
 * @desc Marks all messages in a specific chat as read for the logged-in user
 * @access Private (Requires Bearer Token)
 */
messageRouter.put("/read/:chatId", auth, markAsRead)   

/**
 * @route GET /api/message/:chatId
 * @desc Retrieves all messages for a specific chat room
 * @access Private (Requires Bearer Token)
 */
messageRouter.get("/:chatId", auth, allMessages)

/**
 * @route DELETE /api/message/:messageId
 * @desc Deletes a message (either for everyone if sender, or only for the logged-in user)
 * @access Private (Requires Bearer Token)
 */
messageRouter.delete("/:messageId", auth, deleteMessage) 

/**
 * @route PUT /api/message/:messageId
 * @desc Edits the text content of a message (must be the sender and within a 15-minute timeframe)
 * @access Private (Requires Bearer Token)
 */
messageRouter.put("/:messageId", auth, editMessage)      

module.exports = messageRouter;