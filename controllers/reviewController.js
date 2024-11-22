const Review = require("../models/Review");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

/**
 * Create a review - protected
 *
 */
const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError("Resource not found");
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "Already submitted a review for this product"
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({ review });
};

/**
 * Get all review - public
 *
 */
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "user product",
    select: "name company price",
  });
  if (!reviews) {
    throw new CustomError.NotFoundError("No reviews available");
  }

  res.status(StatusCodes.OK).json({ nbHits: reviews.length, reviews });
};

/**
 * get a single review - public
 *
 */
const getSingleReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id }).populate({
    path: "user product",
    select: "name company price",
  });
  
  if (!review) {
    throw new CustomError.NotFoundError("No review available");
  }
  res.status(StatusCodes.OK).json({ review });
};

/**
 * Create a review - protected
 *
 */

const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError("No review available");
  }
  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

/**
 * delete review - protected
 *
 */
const deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError("Resource not found");
  }
  // the owner/admin are the only one who can remove their review
  checkPermissions(req.user, review.user);
  await review.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "review deleted successfully" });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};