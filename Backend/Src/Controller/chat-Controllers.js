const Chat = require("../Model/chatModel");
const User = require("../Model/userModel");
const mongoose = require("mongoose");

/**
 * @api {post} /api/chat/access Create Chat
 * @apiName AccessChat
 * @apiGroup Chat
 * @description Creates a new chat between two users if it doesn't exist, otherwise returns the existing chat.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<import('express').Response>}
 */
const accessChats = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId not sent in request",
      });
    }

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password -refreshToken")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "username pic email",
    });

    if (isChat.length > 0) {
      return res.status(200).json({
        success: true,
        data: isChat[0],
      });
    }

    const createdChat = await Chat.create({
      chatName: "one-on-one",
      isGroupChat: false,
      users: [req.user._id, userId],
    });

    const fullChat = await Chat.findById(createdChat._id).populate(
      "users",
      "-password -refreshToken"
    );

    return res.status(200).json({
      success: true,
      data: fullChat,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @api {get} /api/chat/all Fetch Chats
 * @apiName FetchChats
 * @apiGroup Chat
 * @description Fetches all chats for the logged-in user.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<import('express').Response>}
 */
const fetchChats = async (req, res, next) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password -refreshToken")
      .populate("groupAdmin", "-password -refreshToken")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "username pic email",
    });

    return res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @api {post} /api/chat/group Create Group Chat
 * @apiName CreateGroupChat
 * @apiGroup Chat
 * @description Creates a new group chat with the specified users.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<import('express').Response>}
 */
const createGroupChat = async (req, res, next) => {
  try {
    const { users, chatName } = req.body;

    if (!users || !chatName) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (!Array.isArray(users)) {
      return res.status(400).json({
        success: false,
        message: "Users must be an array",
      });
    }

    if (users.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least 2 users are required to form a group",
      });
    }

    const validUsers = users.filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (validUsers.length !== users.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID detected",
      });
    }

    const allUsers = [...new Set([...validUsers, req.user._id])];

    const groupChat = await Chat.create({
      chatName,
      users: allUsers,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password -refreshToken")
      .populate("groupAdmin", "-password -refreshToken");

    return res.status(201).json({
      success: true,
      data: fullGroupChat,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @api {put} /api/chat/rename Rename Group
 * @apiName RenameGroup
 * @apiGroup Chat
 * @description Renames a group chat. Only the admin can perform this action.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<import('express').Response>}
 */
const renameGroup = async (req, res, next) => {
  try {
    const { chatId, chatName } = req.body;

    if (!chatId || !chatName) {
      return res.status(400).json({
        success: false,
        message: "chatId and chatName are required",
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only admin can perform this action",
      });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $set: { chatName } },
      { new: true }
    )
      .populate("users", "-password -refreshToken")
      .populate("groupAdmin", "-password -refreshToken");

    return res.status(200).json({
      success: true,
      data: updatedChat,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @api {put} /api/chat/remove Remove from Group
 * @apiName RemoveFromGroup
 * @apiGroup Chat
 * @description Removes a user from a group chat. Only the admin can perform this action.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<import('express').Response>}
 */
const removeFromGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      return res.status(400).json({
        success: false,
        message: "chatId and userId are required",
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only admin can perform this action",
      });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password -refreshToken")
      .populate("groupAdmin", "-password -refreshToken");

    return res.status(200).json({
      success: true,
      data: updatedChat,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @api {put} /api/chat/add Add to Group
 * @apiName AddToGroup
 * @apiGroup Chat
 * @description Adds a user to a group chat. Only the admin can perform this action.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<import('express').Response>}
 */
const addToGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      return res.status(400).json({
        success: false,
        message: "chatId and userId are required",
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only admin can perform this action",
      });
    }

    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { users: userId } },
      { new: true }
    )
      .populate("users", "-password -refreshToken")
      .populate("groupAdmin", "-password -refreshToken");

    return res.status(200).json({
      success: true,
      data: added,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  accessChats,
  renameGroup,
  removeFromGroup,
  fetchChats,
  createGroupChat,
  addToGroup,
};