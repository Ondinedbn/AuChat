const express = require("express");

const { getUsers } = require("../controllers/userController");

const User = require("../models/User");

const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

router.route("/").get(advancedResults(User), getUsers);

module.exports = router;
