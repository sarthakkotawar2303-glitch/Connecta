const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");

/**
 * Intercepts incoming HTTP requests to validate bearer tokens inside authorization headers.
 * Hydrates the Express request context with account profiles while stripping access credentials.
 * 
 * @async
 * @function auth
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response stream.
 * @param {import('express').NextFunction} next - Pipeline advancement callback hook.
 * @returns {Promise<import('express').Response|void>} Advances pipeline if token parses; blocks with 401 on exceptions.
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password -refreshToken");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists in system registry",
      });
    }

    req.user = user;

    return next();

  } catch (error) {
    console.error("Authentication middleware gate catch:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token validation signature",
    });
  }
};

module.exports = auth;
