const jwt = require("jsonwebtoken");
const { createError } = require("./errorUtils");

const generateToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d", // Default 7 days
    });
  } catch (error) {
    throw createError("Error generating token", 500, error);
  }
};

// Optional: Add refresh token generation
const generateRefreshToken = (payload) => {
  try {
    return jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d", // Default 30 days
      }
    );
  } catch (error) {
    throw createError("Error generating refresh token", 500, error);
  }
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw createError("Token has expired", 401, error);
    } else if (error.name === "JsonWebTokenError") {
      throw createError("Invalid token", 401, error);
    } else {
      throw createError("Token verification failed", 401, error);
    }
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
};
