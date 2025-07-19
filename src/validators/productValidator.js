const { z } = require("zod");
const { createValidationError } = require("../utils/errorUtils");

// Product schema for validation
const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  inStock: z.coerce.boolean().optional().default(true),
});

// Validate product data
const validateProduct = (data) => {
  try {
    // Parse and validate the data
    return productSchema.parse(data);
  } catch (error) {
    // Format Zod errors into a more readable format
    const formattedErrors = error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));
    console.log("formattedErrors", formattedErrors);
    throw createValidationError("Validation failed", formattedErrors);
  }
};

// Partial validation for updates
const validateProductUpdate = (data) => {
  try {
    return productSchema.partial().parse(data);
  } catch (error) {
    const formattedErrors = error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));

    throw createValidationError("Validation failed", formattedErrors);
  }
};

module.exports = {
  validateProduct,
  validateProductUpdate,
};
