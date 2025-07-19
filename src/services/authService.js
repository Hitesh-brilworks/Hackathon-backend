const userModel = require("../models/userModel");
const { generateToken } = require("../utils/jwtUtils");
const { createError } = require("../utils/errorUtils");

const registerUser = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email: userData.email });
    if (existingUser) {
      throw createError("User with this email already exists", 409);
    }

    // Create new user
    const user = new userModel(userData);
    await user.save();

    // Generate JWT token

    // Return user data without password
    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      user: userResponse,
    };
  } catch (error) {
    if (error.code === 11000) {
      throw createError("User with this email already exists", 409);
    }
    throw error;
  }
};

const loginUser = async (email, password) => {
  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      throw createError("Invalid email or password", 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw createError("Account is deactivated", 401);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw createError("Invalid email or password", 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      email: user.email,
    });

    // Return user data without password
    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      user: userResponse,
      token,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser,
};
