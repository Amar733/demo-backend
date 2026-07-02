const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { catchAsync } = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = catchAsync(async (req, res, next) => {
  const { items, shippingAddress, paymentInfo } = req.body;

  // Validate items and check stock
  const orderItems = [];
  let itemsTotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product || !product.isActive) {
      return next(new ErrorResponse(`Product not found: ${item.product}`, 404));
    }

    if (product.stock < item.quantity) {
      return next(new ErrorResponse(`Insufficient stock for ${product.name}`, 400));
    }

    const price = product.specialPrice || product.price;
    orderItems.push({
      product: product._id,
      name: product.name,
      price,
      quantity: item.quantity
    });

    itemsTotal += price * item.quantity;

    // Update product stock
    product.stock -= item.quantity;
    await product.save();
  }

  // Calculate pricing
  const shippingCharges = itemsTotal > 50000 ? 0 : 500; // Free shipping above ₹500
  const tax = Math.round(itemsTotal * 0.18); // 18% GST
  const totalAmount = itemsTotal + shippingCharges + tax;

  // Create order
  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    paymentInfo,
    pricing: {
      itemsTotal,
      shippingCharges,
      tax,
      totalAmount
    }
  });

  // Clear user's cart
  await Cart.findOneAndUpdate(
    { user: req.user.id },
    { items: [], total: 0 }
  );

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Get all orders for logged in user
// @route   GET /api/orders
// @access  Private
exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .populate('items.product', 'name image')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product', 'name image description');

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Make sure user owns this order or is admin
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this order', 403));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status, note } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  order.orderStatus = status;

  if (note) {
    order.statusHistory.push({
      status,
      note
    });
  }

  if (status === 'delivered') {
    order.deliveryDate = Date.now();
  }

  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Make sure user owns this order
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to cancel this order', 403));
  }

  // Check if order can be cancelled
  if (['delivered', 'cancelled', 'returned'].includes(order.orderStatus)) {
    return next(new ErrorResponse('Cannot cancel this order', 400));
  }

  // Restore product stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity }
    });
  }

  order.orderStatus = 'cancelled';
  order.cancelReason = req.body.reason || 'Cancelled by user';
  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find()
    .populate('user', 'name mobile')
    .populate('items.product', 'name')
    .sort('-createdAt');

  // Calculate total sales
  const totalSales = orders.reduce((sum, order) => {
    if (order.orderStatus !== 'cancelled') {
      return sum + order.pricing.totalAmount;
    }
    return sum;
  }, 0);

  res.status(200).json({
    success: true,
    count: orders.length,
    totalSales,
    data: orders
  });
});

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
exports.getOrderStats = catchAsync(async (req, res, next) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 },
        totalAmount: { $sum: '$pricing.totalAmount' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats
  });
});
