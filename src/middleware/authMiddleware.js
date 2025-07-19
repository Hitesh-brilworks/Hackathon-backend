const { verifyToken } = require("../utils/jwtUtils");
const { createError } = require("../utils/errorUtils");
const userModel = require("../models/userModel");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw createError("Access token is required", 401);
    }

    const decoded = verifyToken(token);

    // Check if user still exists
    const user = await userModel.findById(decoded.userId).select("-password");
    if (!user) {
      throw createError("User no longer exists", 401);
    }

    if (!user.isActive) {
      throw createError("User account is deactivated", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateToken,
};
