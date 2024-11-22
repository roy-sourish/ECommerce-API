const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

/**
 * Create a product - Protected/Admin
 * POST => /api/v1/products
 */
const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);

  res.status(StatusCodes.CREATED).json({ product });
};

/**
 * Get all products - Public
 * GET => /api/v1/products
 */
const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  if (!products) {
    throw new CustomError.NotFoundError("Resource not found");
  }
  res.status(StatusCodes.OK).json({ products });
};

/**
 * Get a single product
 * GET => /api/v1/products/:id
 */
const getSingleProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id }).populate(
    "reviews"
  );
  if (!product) {
    throw new CustomError.NotFoundError("Resource not found");
  }
  res.status(StatusCodes.OK).json({ product });
};

/**
 * Update product - Protected/Admin
 * PATCH => /api/v1/products/:id
 */
const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    returnOriginal: false,
    runValidators: true,
  });

  if (!product) {
    throw new CustomError.NotFoundError("Resource not found");
  }
  res.status(StatusCodes.OK).json({ product });
};

/**
 * Delete a product - Protected/Admin
 * DELETE => /api/v1/products/:id
 */
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    throw new CustomError.NotFoundError("Resource not found");
  }
  await product.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "product deleted successfully" });
};

/**
 * Upload product Image - Protected/Admin
 * POST => /api/v1/products
 */
const uploadImage = async (req, res) => {
  /* @TODO: use Multer to handld upload image functionality */
  res.status(StatusCodes.OK).json({ msg: "upload product image" });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
