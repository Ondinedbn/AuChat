const express = require("express");
const router = express.Router();
const { getProducts } = require("../controllers/productsController");

// Create a route with express
router.route("/").get(getProducts);

module.exports = router;
