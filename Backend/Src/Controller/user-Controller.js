const User = require("../Model/userModel");
const { generateAccessToken, generateRefreshToken } = require("../service/authTokens");
const uploadToCloudinary = require("../service/cloudinary");

/**
 * @api {post} /api/user/signup Create User Account
 * @apiName SignUp
 * @apiGroup Authentication
 * @description Registers a new user with email and password, handles optional profile picture 
 * uploads to Cloudinary, generates authentication tokens, and sets a secure HttpOnly cookie.
 */
const signUp = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
    }

    username = username.trim();
    email = email.trim().toLowerCase();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    let imageUrl = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

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

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        pic: newUser.pic,
        accessToken,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @api {post} /api/user/login Authenticate User Credentials
 * @apiName LoginUser
 * @apiGroup Authentication
 * @description Validates user email and password fields, creates fresh authorization token pairs, updates state vectors via isolated updates, and sets persistent response cookies.
 */
const loginUser = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
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
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        pic: user.pic,
        accessToken,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @api {get} /api/user/all Retrieve User Directory
 * @apiName AllUsers
 * @apiGroup Users
 * @description Queries the user collection to search for active application accounts using a partial, case-insensitive string match on username or email fields. Automatically filters out the requesting user's profile from the results and strips sensitive tokens.
 */
const allUsers = async (req, res, next) => {
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

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @api {post} /api/user/logout Terminate User Session
 * @apiName LogoutUser
 * @apiGroup Authentication
 * @description Inactivates user sessions by extracting the refresh token from client cookies, purging the active token from the respective database record, and clearing the HttpOnly cookie.
 */
const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signUp,
  loginUser,
  allUsers,
  logoutUser,
};