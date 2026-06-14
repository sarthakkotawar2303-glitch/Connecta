const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



/**
 * @typedef {Object} IUser
 * @property {string} username - The cleartext display name chosen by the user.
 * @property {string} email - Unique, lowercase email address utilized for login notifications.
 * @property {string} password - Hashed security credentials (excluded from standard queries by default).
 * @property {string} [refreshToken] - Optional active session JWT token for renewing credentials.
 * @property {string} pic - Fully qualified URL pointing to the user's avatar image resource.
 * @property {boolean} isOnline - Real-time network socket status indicator.
 * @property {Date} lastSeen - Timestamp logging the user's most recent interaction or heartbeat event.
 * @property {Date} createdAt - Automated timestamp marking account generation date.
 * @property {Date} updatedAt - Automated timestamp detailing the last field modification date.
 */

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    refreshToken: {
        type: String
    },
    pic: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isOnline: {                      
        type: Boolean,
        default: false,
    },
    lastSeen: {                     
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});


UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


const User = mongoose.model("User", UserSchema);
module.exports = User;
