const mongoose = require('mongoose');

/**
 * @typedef {Object} IMessage
 * @property {mongoose.Types.ObjectId} sender - The ID of the user who sent the message. Reference to 'User'.
 * @property {string} content - The textual content of the message. Leading/trailing whitespaces are trimmed.
 * @property {mongoose.Types.ObjectId} chat - The ID of the chat room this message belongs to. Reference to 'Chat'.
 * @property {mongoose.Types.ObjectId[]} readBy - Array of user IDs who have read this message. References to 'User'.
 * @property {boolean} isDeleted - Flags whether the message was deleted for everyone. Defaults to false.
 * @property {boolean} isEdited - Flags whether the message content has been modified. Defaults to false.
 * @property {mongoose.Types.ObjectId[]} deleteFor - Array of user IDs who chose to hide this message from their own timeline ("Delete for Me"). References to 'User'.
 * @property {Date} createdAt - The timestamp indicating when the message was created (automatically managed by Mongoose).
 * @property {Date} updatedAt - The timestamp indicating when the message was last updated (automatically managed by Mongoose).
 */


const msgSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        trim: true,
        required: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    readBy: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        default: []
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
    isEdited: { 
        type: Boolean, 
        default: false 
    },
    deleteFor: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        default: []
    }
}, {
    timestamps: true
});

msgSchema.index({ chat: 1, isDeleted: 1, createdAt: -1 });
const Msg = mongoose.model("Message", msgSchema);

module.exports = Msg;
