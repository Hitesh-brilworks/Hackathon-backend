const productService = require("./../services/productService");
const {
  validateProduct,
  validateProductUpdate,
} = require("../validators/productValidator");
const { createError } = require("../utils/errorUtils");
const { upload, generateImageUrl } = require("../utils/uploadUtils");

// Helper function to transform form data
const transformFormData = (data) => {
  const transformed = { ...data };

  // Convert price to number
  if (transformed.price) {
    transformed.price = parseFloat(transformed.price);
  }

  // Convert inStock to boolean
  if (transformed.inStock !== undefined) {
    transformed.inStock =
      transformed.inStock === "true" || transformed.inStock === true;
  }

  return transformed;
};

// Create a new product
const createProduct = async (req, res, next) => {
  try {
    // Transform form data before validation
    const transformedData = transformFormData(req.body);

    // Validate request body
    const validatedData = validateProduct(transformedData);

    // Add image URL if file was uploaded
    if (req.file) {
      validatedData.image = generateImageUrl(req, req.file.filename);
    }

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

    // Transform form data before validation
    const transformedData = transformFormData(req.body);

    // Validate request body
    const validatedData = validateProductUpdate(transformedData);

    // Add image URL if file was uploaded
    if (req.file) {
      validatedData.image = generateImageUrl(req, req.file.filename);
    }

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

    // Transform form data before validation
    const transformedData = transformFormData(req.body);

    // Validate request body
    const validatedData = validateProductUpdate(transformedData);

    // Add image URL if file was uploaded
    if (req.file) {
      validatedData.image = generateImageUrl(req, req.file.filename);
    }

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

// Get all products
const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Get product by ID
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      throw createError(`Product with id ${id} not found`, 404);
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  updateProduct,
  patchProduct,
  getAllProducts,
  getProductById,
};
