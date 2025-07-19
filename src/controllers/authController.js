const authService = require("../services/authService");
const {
  validateRegister,
  validateLogin,
} = require("../validators/authValidator");

const register = async (req, res, next) => {
  try {
    // Validate request data
    const validatedData = validateRegister(req.body);

    // Register user
    const result = await authService.registerUser(validatedData);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    // Validate request data
    const { email, password } = validateLogin(req.body);

    // Login user
    const result = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
