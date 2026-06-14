const mongoose = require("mongoose");

/**
 * @class Chat
 * @extends {mongoose.Model}
 * @description Core entity managing data layers for group chats and private 1-on-1 conversations.
 * Tracks participant memberships, group hierarchy states, and the most recent messaging preview.
 * 
 * @property {string} chatName - Clean, sanitized textual label designating the conversation workspace name.
 * @property {boolean} isGroupChat - Boundary state flag separating multi-user rooms from 1-on-1 direct channels.
 * @property {mongoose.Schema.Types.ObjectId[]} users - Array containing references to participant User document IDs.
 * @property {mongoose.Schema.Types.ObjectId} [latestMessage] - Optional structural reference pointing to the last Message ID.
 * @property {mongoose.Schema.Types.ObjectId} [groupAdmin] - Optional User reference tracking the administrative moderator.
 */
const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
      required: true,
    },

    isGroupChat: {
      type: Boolean,
      default: false,
    },

    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
