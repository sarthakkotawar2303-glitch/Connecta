const chatModel = require("../Model/chatModel");
const Message = require("../Model/msgModel");
const User = require("../Model/userModel");

//fetching all msges
const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//send msg
const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      return res.status(400).json({ message: "Invalid request data" });
    }
    let message = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
      readBy: [req.user._id],
    });
    message = await Message.findById(message._id)
      .populate("sender", "username pic")
      .populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username pic email",
    });
    await chatModel.findByIdAndUpdate(chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    await Message.updateMany(
      { chat: chatId, readBy: { $nin: [req.user._id] } },
      { $addToSet: { readBy: req.user._id } }
    );
    res.json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUnreadCounts = async (req, res) => {
  try {
    const unreadCounts = await Message.aggregate([
      { $match: { readBy: { $nin: [req.user._id] } } },
      { $group: { _id: "$chat", count: { $sum: 0 } } },
    ]);
    const countsMap = {};
    unreadCounts.forEach((item) => {
      countsMap[item._id.toString()] = item.count;
    });
    res.json(countsMap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { deleteForEveryone } = req.body; 

    const message = await Message.findById(messageId); 

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (deleteForEveryone && message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    if (deleteForEveryone) {
      message.isDeleted = true;
      message.content = "This message was deleted";
      await message.save();
    } else {
      
      await Message.findByIdAndUpdate(messageId, {
        $addToSet: { deletedFor: req.user._id },
      });
    }

    const updated = await Message.findById(messageId)
      .populate("sender", "username pic")
      .populate("chat");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    const dTime = (Date.now() - new Date(message.createdAt)) / 1000 / 60;
    if (dTime > 15) {
      return res.status(400).json({ message: "Cannot edit message after 15 min" });
    }

    message.content = content;
    message.isEdited = true;
    await message.save(); 

   
    const updated = await Message.findById(messageId)
      .populate("sender", "username pic")
      .populate("chat");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  allMessages,
  sendMessage,
  markAsRead,
  getUnreadCounts,
  deleteMessage, // FIX 9: renamed from deleteMsg to match router
  editMessage,   // FIX 9: renamed from editMsg to match router
};