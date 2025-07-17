const { ono } = require('@jsdevtools/ono');

/**
 * Create an error with custom properties
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Error} originalError - Original error to wrap (optional)
 * @param {Object} additionalProps - Additional properties to add to the error
 * @returns {Error} Enhanced error object
 */
const createError = (message, statusCode = 500, originalError = null, additionalProps = {}) => {
  const props = {
    status: statusCode,
    ...additionalProps
  };
  
  if (originalError) {
    return ono(originalError, props, message);
  }
  
  return ono(props, message);
};

/**
 * Create a validation error
 * @param {string} message - Error message
 * @param {Object} validationErrors - Validation error details
 * @returns {Error} Enhanced error object
 */
const createValidationError = (message, validationErrors) => {
  return createError(message, 400, null, { validationErrors });
};

module.exports = {
  createError,
  createValidationError
};