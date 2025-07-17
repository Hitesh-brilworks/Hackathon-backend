const Product = require("../models/productModel");
const { createError } = require("../utils/errorUtils");

// Create a new product
const createProduct = async (productData) => {
  try {
    const product = new Product(productData);
    console.log("product", product);
    return await product.save();
  } catch (error) {
    throw createError("Error creating product", 500, error);
  }
};

// Get a product by ID
const getProductById = async (id) => {
  try {
    return await Product.findById(id);
  } catch (error) {
    throw createError("Error fetching product", 500, error);
  }
};

// Update a product
const updateProduct = async (id, productData) => {
  try {
    return await Product.findByIdAndUpdate(id, productData, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    throw createError("Error updating product", 500, error);
  }
};

module.exports = {
  createProduct,
  getProductById,
  updateProduct,
};
