const User = require("../Model/userModel");
const { generateAccessToken, generateRefreshToken } = require("../service/authTokens");
const uploadToCloudinary = require("../service/cloudinary");



//signup
const signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please enter all required fields",
      });
    }

    // Normalize input
    username = username.trim();
    email = email.trim().toLowerCase();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    let imageUrl =
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.path);
      imageUrl = uploaded.url;
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

//Login
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

//search users
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

//Logout
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