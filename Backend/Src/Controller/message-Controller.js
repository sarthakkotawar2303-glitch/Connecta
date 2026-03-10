const chatModel = require("../Model/chatModel");
const Message = require("../Model/msgModel");
const User = require("../Model/userModel");

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
      { $group: { _id: "$chat", count: { $sum: 1 } } },
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

// ─────────────────────────────────────────
// DELETE /api/message/:messageId
// ─────────────────────────────────────────
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { deleteForEveryone } = req.body; // FIX 1: was destructuring array [deleteForAll]

    const message = await Message.findById(messageId); // FIX 2: was "msg", inconsistent naming

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // FIX 3: was comparing to sender._id which is undefined — use message.sender
    if (deleteForEveryone && message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    if (deleteForEveryone) {
      message.isDeleted = true;
      message.content = "This message was deleted";
      await message.save();
    } else {
      // FIX 4: was calling msg.findByIdAndUpdate (method on instance, not model)
      // and missing $addToSet for deletedFor
      await Message.findByIdAndUpdate(messageId, {
        $addToSet: { deletedFor: req.user._id },
      });
    }

    // FIX 5: was missing the populated response after delete-for-me branch
    const updated = await Message.findById(messageId)
      .populate("sender", "username pic")
      .populate("chat");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────
// PUT /api/message/:messageId
// ─────────────────────────────────────────
const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await Message.findById(messageId);

    // FIX 6: was checking !messageId instead of !message
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
    await message.save(); // FIX 7: was "mes.save()" — typo, undefined variable

    // FIX 8: was Message.find(messageId) — should be findById, and populate chained wrong
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