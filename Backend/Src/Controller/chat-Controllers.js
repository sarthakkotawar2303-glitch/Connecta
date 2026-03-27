const Chat = require("../Model/chatModel");
const User = require("../Model/userModel");
const mongoose = require("mongoose");

//AccessChats
const accessChats = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId not sent in request" });
    }

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user.id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "username pic email",
    });

    if (isChat.length > 0) {
      return res.status(200).json(isChat[0]);
    }

    const createdChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.id, userId],
    });

    const fullChat = await Chat.findById(createdChat._id).populate(
      "users",
      "-password"
    );

    res.status(200).json(fullChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fetch all chats
const fetchChats = async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user.id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "username pic email",
    });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createGroupChat = async (req, res) => {
  try {
    const { users, chatName } = req.body;

    if (!users || !chatName) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (!Array.isArray(users)) {
      return res.status(400).json({ message: "Users must be an array" });
    }

    if (users.length < 2) {
      return res.status(400).json({
        message: "At least 2 users are required to form a group",
      });
    }

    const validUsers = users.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validUsers.length !== users.length) {
      return res.status(400).json({ message: "Invalid user ID detected" });
    }

    const allUsers = [...new Set([...validUsers, req.user.id])];

    const groupChat = await Chat.create({
      chatName,
      users: allUsers,
      isGroupChat: true,
      groupAdmin: req.user.id,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(201).json(fullGroupChat);
  } catch (error) {
    console.error("Create Group Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// renaming chat
const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only admin can perform this action" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// remove user
const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only admin can perform this action" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// add to group
const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only admin can perform this action" });
    }

    
    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(added);
  } catch (error) {
    res.status(500).json({ message: error.message });
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