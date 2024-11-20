const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
/**
 * Get all users
 * GET => /api/v1/users/
 */
const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  if (!users) {
    throw new CustomError.NotFoundError("Resource not found!");
  }
  res.status(StatusCodes.OK).json({ users });
};

/**
 * Get single user
 * GET => /api/v1/users/:id
 */
const getSingleUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError("Resource not found!");
  }
  res.status(StatusCodes.OK).json({ user });
};

/**
 * show current user
 * GET => /api/v1/users/
 */
const showCurrentUser = async (req, res) => {
  res.json({ msg: "show current user" });
};

/**
 * update user
 * @route GET => /api/v1/users/
 */
const updateUser = async (req, res) => {
  res.json({ msg: "update user" });
};

/**
 * update user password
 * @route GET => /api/v1/users/
 */
const updateUserPassword = async (req, res) => {
  res.json({ msg: "update user password" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
