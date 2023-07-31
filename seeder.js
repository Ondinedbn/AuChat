const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
const Product = require("./models/Product");
const User = require("./models/User");

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {});

// Read JSON files
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/products.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await Product.create(products);
    await User.create(users);
    console.log("Data imported ...".green.inverse);
  } catch (err) {
    console.error(err);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    console.log("Data destroyed ...".red.inverse);
  } catch (err) {
    console.error(err);
  }
};

// Use 'node seeder -i' or 'node seeder -d'
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
