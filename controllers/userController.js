const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createUserToken,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");
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
  checkPermissions(req.user, user._id);
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
  const { name, email } = req.body;
  if (!name || !email) {
    throw new CustomError.BadRequestError("Please provide name and email");
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { name, email },
    { returnOriginal: false, runValidators: true }
  );
  /**
   * @NOTE: if we manually update the email and password and do a user.save()
   *        like in updateUserPassword(), it will invoke the pre-save and the
   *        hashed-password will get rehashed again resulting in throwing an
   *        invaild credentials error.
   *  */
  const tokenUser = createUserToken(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.json({ user });
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
