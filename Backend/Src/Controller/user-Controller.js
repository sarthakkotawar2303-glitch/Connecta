const User = require("../Model/userModel");
const { generateAccessToken, generateRefreshToken } = require("../service/authTokens");
const uploadToCloudinary = require("../service/cloudinary");



/**
 * 
 * @api {post} /api/user/signup Create User Account
 * @apiName SignUp
 * @apiGroup Authentication
 * @description Registers a new user with email and password, handles optional profile picture 
 * uploads to Cloudinary, generates authentication tokens, and sets a secure HttpOnly cookie.
 * @async
 * @function signUp
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.username - The username of the user.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} [req.file] - Optional profile picture uploaded via Multer.
 * @param {string} req.file.path - Local path of the uploaded profile picture.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} Express response JSON object containing user details and access token on success, or an error message.
 */
const signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success:false,
        message: "Please enter all required fields",
      });
    }


    username = username.trim();
    email = email.trim().toLowerCase();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success:false,
        message: "User already exists",
      });
    }

    let imageUrl =
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

    if (req.file) {
      try {
        const uploaded = await uploadToCloudinary(req.file.path);
        imageUrl = uploaded.url;
      } catch (uploadError) {
        console.error("Cloudinary upload failed, falling back to default placeholder:", uploadError);
      }
    }

    const newUser = await User.create({
      username,
      email,
      password,
      pic: imageUrl,
    });

    // Generate tokens
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Send refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      pic: newUser.pic,
      accessToken,
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/**
 * @api {post} /api/user/login Authenticate User Credentials
 * @apiName LoginUser
 * @apiGroup Authentication
 * @description Validates user email and password fields, creates fresh authorization token pairs, updates state vectors via isolated updates, and sets persistent response cookies.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<import('express').Response>}
 */
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      pic: user.pic,
      accessToken,
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/**
 * @api {get} /api/user/all Retrieve User Directory
 * @apiName AllUsers
 * @apiGroup Users
 * @description Queries the user collection to search for active application accounts using a partial, case-insensitive string match on username or email fields. Automatically filters out the requesting user's profile from the results and strips sensitive tokens.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<import('express').Response>}
 */
const allUsers = async (req, res) => {
  try {
    const search = req.query.search;

    const keyword = search
      ? {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find({
      ...keyword,
      _id: { $ne: req.user._id },
    }).select("-password -refreshToken");

    return res.status(200).json(users);

  } catch (error) {
    console.error("User search error:", error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/**
 * @api {post} /api/user/logout Terminate User Session
 * @apiName LogoutUser
 * @apiGroup Authentication
 * @description Inactivates user sessions by extracting the refresh token from client cookies, purging the active token from the respective database record, and clearing the HttpOnly cookie.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<import('express').Response>}
 */
const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshToken },
        { refreshToken: null }
      );
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });

  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Logout failed",
    });
  }
};


module.exports = {
  signUp,
  loginUser,
  allUsers,
  logoutUser,
};