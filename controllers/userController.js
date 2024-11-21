const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
/**
 * Get all users
 * GET => /api/v1/users/
 */
const getAllUsers = async (req, res) => {
  console.log("userController:: request user", req.user);
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
  res.status(StatusCodes.OK).json({ user: req.user });
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
 * @route PATCH => /api/v1/users/
 */
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide email or password");
  }
  const { userId } = req.user;
  const user = await User.findOne({ _id: userId });

  // check password
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  user.password = newPassword;
  await user.save();
  res.json({ user });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
