const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { catchAsync } = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate({
    path: 'items.product',
    select: 'name price specialPrice image stock isActive'
  });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  // Filter out inactive products
  cart.items = cart.items.filter(item => item.product && item.product.isActive);
  await cart.save();

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  // Check if product exists and is active
  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // Check stock availability
  if (product.stock < quantity) {
    return next(new ErrorResponse('Insufficient stock', 400));
  }

  // Get or create cart
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  // Check if product already in cart
  const existingItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  const price = product.specialPrice || product.price;

  if (existingItemIndex > -1) {
    // Update quantity
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;
    
    if (product.stock < newQuantity) {
      return next(new ErrorResponse('Insufficient stock', 400));
    }

    cart.items[existingItemIndex].quantity = newQuantity;
    cart.items[existingItemIndex].price = price;
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      quantity,
      price
    });
  }

  await cart.save();

  // Populate and return
  cart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: 'name price specialPrice image stock isActive'
  });

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateCartItem = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (quantity < 1) {
    return next(new ErrorResponse('Quantity must be at least 1', 400));
  }

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  // Find item in cart
  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return next(new ErrorResponse('Item not found in cart', 404));
  }

  // Check stock
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return next(new ErrorResponse('Product not found', 404));
  }

  if (product.stock < quantity) {
    return next(new ErrorResponse('Insufficient stock', 400));
  }

  // Update quantity
  cart.items[itemIndex].quantity = quantity;
  cart.items[itemIndex].price = product.specialPrice || product.price;

  await cart.save();

  // Populate and return
  const updatedCart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: 'name price specialPrice image stock isActive'
  });

  res.status(200).json({
    success: true,
    data: updatedCart
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  // Remove item
  cart.items = cart.items.filter(
    item => item.product.toString() !== productId
  );

  await cart.save();

  // Populate and return
  const updatedCart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: 'name price specialPrice image stock isActive'
  });

  res.status(200).json({
    success: true,
    data: updatedCart
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  cart.items = [];
  cart.total = 0;
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart cleared successfully',
    data: cart
  });
});
