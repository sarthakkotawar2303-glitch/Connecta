const Chat = require("../Model/chatModel");
const User = require("../Model/userModel");

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

// fetch all charts
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

//creating group chat
const mongoose = require("mongoose");

const createGroupChat = async (req, res) => {
  try {
    const { users, chatName } = req.body;

    //Basic validation
    if (!users || !chatName) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Ensure users is array
    if (!Array.isArray(users)) {
      return res.status(400).json({ message: "Users must be an array" });
    }

    // Minimum 2 users check
    if (users.length < 2) {
      return res.status(400).json({
        message: "At least 2 users are required to form a group",
      });
    }

    //Validate Mongo IDs
    const validUsers = users.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validUsers.length !== users.length) {
      return res.status(400).json({ message: "Invalid user ID detected" });
    }

    // Add logged in user safely & remove duplicates
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

//rnameing chat
const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//remove user
const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//addToGroup
const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

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