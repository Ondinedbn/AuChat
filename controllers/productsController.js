const Product = require("../models/Product");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const path = require("path");
const fs = require("fs");

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  let query;
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query String
  let queryStr = JSON.stringify(reqQuery);

  // Create operators $gte, $gt etc
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = Product.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    console.log(fields);
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Product.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const products = await query;

  // Pagination results
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    msg: "Show all products",
    count: products.length,
    data: products,
  });
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    msg: `Show Product ${req.params.id}`,
    data: product,
  });
});

// @desc    Create new product
// @route   POST /api/v1/products/
// @access  Private
exports.createProduct = asyncHandler(async (req, res, next) => {
  console.log(req.files);
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.picture;

  console.log(file);

  // Make sure the image is a picture
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Merci de choisir une image`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Le poids du fichier doit être inférieur à ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  const product = await Product.create(req.body);

  // Create custom filename
  file.name = `photo_${product._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
  });

  await Product.findByIdAndUpdate(product._id, { picture: file.name });

  res.status(201).json({
    success: true,
    msg: "Created new product",
    data: product,
  });
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id ${req.params.id}`, 404)
    );
  }
  if (req.files) {
    const file = req.files.picture;
    // Make sure the image is a picture
    if (!file.mimetype.startsWith("image")) {
      return next(new ErrorResponse(`Merci de choisir une image`, 400));
    }

    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Le poids du fichier doit être inférieur à ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }

    // Create custom filename
    file.name = `photo_${product._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }
    });

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { picture: file.name },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    msg: `Update product ${req.params.id}`,
    data: product,
  });
});

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(400).json({ success: false });
  }

  // Check if picture exists
  let file = fs.existsSync(
    `${process.env.FILE_UPLOAD_PATH}/${product.picture}`
  );
  // Delete picture with prod_id
  if (file) {
    fs.unlink(
      `${process.env.FILE_UPLOAD_PATH}/${product.picture}`,
      function () {
        console.log("File deleted");
        product.deleteOne();

        res.status(200).json({
          success: "true",
          msg: `Deleted product ${product.title}`,
        });
      }
    );
  } else {
    console.log("File not found");
  }
});

// @desc    Upload picture for product
// @route   PUT /api/v1/products/:id/picture
// @access  Private
exports.productPictureUpload = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;
  console.log(file);

  // Make sure the image is a picture
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  // Create custom filename
  file.name = `photo_${product._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Product.findByIdAndUpdate(req.params.id, { picture: file.name });

    res.status(200).json({
      success: true,
      msg: `Picture uploaded for product ${req.params.id}`,
      data: product,
    });
  });

  // product = await Product.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });
});
