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

// SIGNUP
router.post("/signup", upload.single("pic"), signUp);

// LOGIN
router.post("/login", loginUser);

// LOGOUT
router.post("/logout", auth, logoutUser);

// GET ALL USERS
router.get("/all", auth, allUsers);

module.exports = router;