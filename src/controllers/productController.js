const Product = require('../models/Product');
const { catchAsync } = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Get all products with filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = catchAsync(async (req, res, next) => {
  // Build query
  const features = new APIFeatures(Product.find({ isActive: true }), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Execute query
  const products = await features.query;

  // Get total count for pagination
  const totalProducts = await Product.countDocuments({ isActive: true });

  res.status(200).json({
    success: true,
    count: products.length,
    total: totalProducts,
    pagination: features.pagination,
    data: products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product || !product.isActive) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // Increment view count
  product.views += 1;
  await product.save();

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Get products by type
// @route   GET /api/products/type/:productType
// @access  Public
exports.getProductsByType = catchAsync(async (req, res, next) => {
  const products = await Product.find({
    productType: req.params.productType,
    isActive: true
  });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get products by collection
// @route   GET /api/products/collection/:collection
// @access  Public
exports.getProductsByCollection = catchAsync(async (req, res, next) => {
  const products = await Product.find({
    collection: req.params.collection,
    isActive: true
  });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get new arrivals
// @route   GET /api/products/filter/new-arrivals
// @access  Public
exports.getNewArrivals = catchAsync(async (req, res, next) => {
  const products = await Product.find({
    isNewArrival: true,
    isActive: true
  }).sort('-createdAt').limit(20);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get products with special pricing
// @route   GET /api/products/filter/special-pricing
// @access  Public
exports.getSpecialPricing = catchAsync(async (req, res, next) => {
  const products = await Product.find({
    specialPrice: { $exists: true, $ne: null },
    isActive: true
  });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = catchAsync(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product (soft delete)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // Soft delete
  product.isActive = false;
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Get product statistics
// @route   GET /api/products/stats/overview
// @access  Private/Admin
exports.getProductStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$productType',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        totalStock: { $sum: '$stock' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats
  });
});
