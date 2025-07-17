const productService = require("./../services/productService");
const {
  validateProduct,
  validateProductUpdate,
} = require("../validators/productValidator");
const { createError } = require("../utils/errorUtils");

// Create a new product
const createProduct = async (req, res, next) => {
  try {
    // Validate request body
    const validatedData = validateProduct(req.body);

    // Create product
    const product = await productService.createProduct(validatedData);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Update a product
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await productService.getProductById(id);
    if (!existingProduct) {
      throw createError(`Product with id ${id} not found`, 404);
    }

    // Validate request body
    const validatedData = validateProductUpdate(req.body);

    // Update product
    const updatedProduct = await productService.updateProduct(
      id,
      validatedData
    );

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Patch a product (partial update)
const patchProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await productService.getProductById(id);
    if (!existingProduct) {
      throw createError(`Product with id ${id} not found`, 404);
    }

    // Validate request body
    const validatedData = validateProductUpdate(req.body);

    // Update product
    const updatedProduct = await productService.updateProduct(
      id,
      validatedData
    );

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  updateProduct,
  patchProduct,
};
