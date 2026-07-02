const { body, param, query, validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

// Middleware to check validation results
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return next(new ErrorResponse(errorMessages.join(', '), 400));
  }
  next();
};

// Auth validators
exports.registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password').trim().notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.loginValidation = [
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

// Product validators
exports.createProductValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Product description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('productType').isIn(['perfume', 'tea', 'coffee', 'powerbank', 'earbuds', 'toy', 'accessory', 'bottle', 'study'])
    .withMessage('Invalid product type'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

exports.updateProductValidation = [
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

// Cart validators
exports.addToCartValidation = [
  body('productId').notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

// Order validators
exports.createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.pincode').trim().notEmpty().withMessage('Pincode is required')
    .matches(/^[0-9]{6}$/).withMessage('Please provide a valid 6-digit pincode'),
  body('shippingAddress.mobile').trim().notEmpty().withMessage('Mobile number is required')
    .matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit mobile number'),
  body('paymentInfo.method').isIn(['cod', 'card', 'upi', 'netbanking'])
    .withMessage('Invalid payment method'),
];

// ObjectId validator
exports.objectIdValidation = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];

// Query validators
exports.paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];
