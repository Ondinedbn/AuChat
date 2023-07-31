const User = require("../models/User");
// const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @description     Get all users
// @route           GET /api/v1/users
// @access          Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
