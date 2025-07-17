const { ono } = require("@jsdevtools/ono");

// Handle 404 errors
const notFound = (req, res, next) => {
  const error = ono(new Error(`Not Found - ${req.originalUrl}`), {
    status: 404,
  });
  next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;

  // Base error response
  const errorResponse = {
    success: false,
    message: err.message || "Internal Server Error",
    statusCode,
  };

  // Add validation errors if they exist
  if (err.validationErrors) {
    errorResponse.validationErrors = err.validationErrors;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = { notFound, errorHandler };
