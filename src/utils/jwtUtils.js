const jwt = require("jsonwebtoken");
const { createError } = require("./errorUtils");

const generateToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });
  } catch (error) {
    throw createError("Error generating token", 500, error);
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
  verifyToken,
};
