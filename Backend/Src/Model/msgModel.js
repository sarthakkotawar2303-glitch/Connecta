const mongoose = require('mongoose')

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
    readBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    isDeleted: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },
    deleteFor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]

}, {
    timestamps: true
})

msgSchema.index({ chat: 1, createdAt: 1 })
const Msg = mongoose.model("Message", msgSchema)

module.exports = Msg