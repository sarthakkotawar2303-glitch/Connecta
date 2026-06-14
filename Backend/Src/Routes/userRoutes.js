const express = require("express");
const {
  signUp,
  loginUser,
  allUsers,
  logoutUser,
} = require("../Controller/user-Controller");

const upload = require("../Middleware/uploadMiddleware");
const auth = require("../Middleware/authMiddleware");

const router = express.Router();

/**
 * @route POST /api/user/signup
 * @desc Registers a new user account with an optional profile picture
 * @access Public
 */
router.post("/signup", upload.single("pic"), signUp);

/**
 * @route POST /api/user/login
 * @desc Authenticates a user's credentials and returns a session token
 * @access Public
 */
router.post("/login", loginUser);

/**
 * @route POST /api/user/logout
 * @desc Terminates the user's active session and clears tokens
 * @access Private (Requires Bearer Token)
 */
router.post("/logout", auth, logoutUser);

/**
 * @route GET /api/user/all
 * @desc Retrieves all registered users matching a search query, excluding the requester
 * @access Private (Requires Bearer Token)
 */
router.get("/all", auth, allUsers);

module.exports = router;