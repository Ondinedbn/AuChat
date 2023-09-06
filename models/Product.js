const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a product title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
  },
  weight: {
    type: Number,
    required: [true, "Please add a weight"],
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
    enum: ["toys", "food", "accessories", "utilities"],
  },
  picture: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", ProductSchema);
