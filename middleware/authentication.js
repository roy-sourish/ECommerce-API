const CustomErr = require("../errors");
const { isTokenValid } = require("../utils");

/**
 * Authenticates user by looking for the available token and sets the res.user 
 * as the received token data.
 */
const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomErr.UnauthenticatedError("Authentication Invalid");
  }
  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new CustomErr.UnauthenticatedError("Authentication Invalid");
  }
};

/**
 * Route protection middleware - only specified roles (eg: admin, etc...) will be allowed to access
 * @param  {...any} roles Example: ['admin', 'user', 'owner']
 */
const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    console.log("admin route");
    if (!roles.includes(req.user.role)) {
      throw new CustomErr.UnauthorizedError(
        "Unauthorized to access this route"
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
