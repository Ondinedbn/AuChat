const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");

// Authorization with auth middleware
const { protect, authorize } = require("../middlewares/auth");

// Create a route with express
router
  .route("/")
  .get(getProducts)
  .post(protect, authorize("admin"), createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(protect, authorize("admin"), updateProduct)
  .delete(protect, authorize("admin"), deleteProduct);

module.exports = router;
