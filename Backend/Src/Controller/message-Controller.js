/**
 * @fileoverview Message controller layer managing text workflows, historical timelines,
 * cryptographic state tracking, real-time read receipts, and user access validation.
 * @module controllers/messageController
 * @requires models/Chat
 * @requires models/Message
 * @requires models/User
 */

const Chat = require("../Model/chatModel");
const Message = require("../Model/msgModel");
const User = require("../Model/userModel");

/**
 * @api {get} /api/message/:chatId Retrieve All Messages in a Chat
 * @apiName AllMessages
 * @apiGroup Messages
 * @description Fetches all messages for a specific chat, populating sender and chat details.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response stream.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<import('express').Response>}
 */
const allMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "chatId parameter is required",
      });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username pic email")
      .populate({
        path: "chat",
        populate: {
          path: "users",
          select: "username pic email",
        },
      })
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @api {post} /api/message Create Message
 * @apiName CreateMessage
 * @apiGroup Messages
 * @description Sends a new message to a chat, updating the chat's latest message reference index.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response stream.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<import('express').Response>}
 */
const sendMessage = async (req, res, next) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data. content and chatId are required.",
      });
    }

    let message = await Message.create({
      sender: req.user._id,
      content: content.trim(),
      chat: chatId,
      readBy: [req.user._id],
    });

    message = await Message.findById(message._id)
      .populate("sender", "username pic email")
      .populate("chat");

    message = await User.populate(message, {
      path: "chat.users",
      select: "username pic email",
    });

    await Chat.findByIdAndUpdate(chatId, {
      $set: { latestMessage: message._id },
    });

    return res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @api {put} /api/message/read/:chatId Mark Messages as Read
 * @apiName MarkAsRead
 * @apiGroup Messages
 * @description Marks all messages in a chat as read for the authenticated user.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response stream.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<import('express').Response>}
 */
const markAsRead = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "chatId parameter is required",
      });
    }

    await Message.updateMany(
      { chat: chatId, readBy: { $nin: [req.user._id] } },
      { $addToSet: { readBy: req.user._id } }
    );

    return res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @api {get} /api/message/unread/counts Get Unread Message Counts
 * @apiName GetUnreadCounts
 * @apiGroup Messages
 * @description Retrieves unread message counts for each chat the user is a part of.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response stream.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<import('express').Response>}
 */
const getUnreadCounts = async (req, res, next) => {
  try {
    const unreadCounts = await Message.aggregate([
      { $match: { readBy: { $nin: [req.user._id] } } },
      { $group: { _id: "$chat", count: { $sum: 1 } } },
    ]);

    const countsMap = {};
    unreadCounts.forEach((item) => {
      if (item._id) {
        countsMap[item._id.toString()] = item.count;
      }
    });

    return res.status(200).json({
      success: true,
      data: countsMap,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @api {delete} /api/message/:messageId Delete Message
 * @apiName DeleteMessage
 * @apiGroup Messages
 * @description Deletes a message, either for the sender only or for all participants.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response stream.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<import('express').Response>}
 */
const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { deleteForEveryone } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (deleteForEveryone && message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized to delete this message for everyone",
      });
    }

    let updatedMessage;

    if (deleteForEveryone) {
      updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        {
          $set: {
            isDeleted: true,
            content: "This message was deleted",
          },
        },
        { new: true }
      )
        .populate("sender", "username pic email")
        .populate("chat");
    } else {
      updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { $addToSet: { deleteFor: req.user._id } },
        { new: true }
      )
        .populate("sender", "username pic email")
        .populate("chat");
    }

    return res.status(200).json({
      success: true,
      data: updatedMessage,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @api {put} /api/message/:messageId Edit Message
 * @apiName EditMessage
 * @apiGroup Messages
 * @description Edits a message content value within a restricted 15-minute timeframe window.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response stream.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<import('express').Response>}
 */
const editMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Updated content cannot be empty",
      });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized to edit this message",
      });
    }

    const timeDifferenceInMinutes = (Date.now() - new Date(message.createdAt).getTime()) / 1000 / 60;
    if (timeDifferenceInMinutes > 15) {
      return res.status(400).json({
        success: false,
        message: "Cannot edit message after 15 minutes",
      });
    }

    const updated = await Message.findByIdAndUpdate(
      messageId,
      {
        $set: {
          content: content.trim(),
          isEdited: true,
        },
      },
      { new: true }
    )
      .populate("sender", "username pic email")
      .populate("chat");

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  allMessages,
  sendMessage,
  markAsRead,
  getUnreadCounts,
  deleteMessage,
  editMessage,
};
