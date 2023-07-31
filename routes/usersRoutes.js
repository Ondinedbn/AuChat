const express = require("express");

const { getUsers } = require("../controllers/userController");

const User = require("../models/User");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middlewares/advancedResults");
const { protect, authorize } = require("../middlewares/auth");

router.use(protect);
router.use(authorize("admin"));

router
  .route("/")
  .get(protect, authorize("admin"), advancedResults(User), getUsers);

module.exports = router;
