const CustomError = require("../errors");

/**
 * 
 * @param {*} requestUser user obj associated with req.user
 * @param {*} resourceUserId userID associate with the specific resource
 * @returns 
 */
const checkPermissions = (requestUser, resourceUserId) => {
  console.log(requestUser);
  console.log(resourceUserId.toString());
  console.log(requestUser.role);
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new CustomError.UnauthorizedError(
    "Not authorized to access this route"
  );
};

module.exports = checkPermissions;
