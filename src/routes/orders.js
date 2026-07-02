const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getOrderStats
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { createOrderValidation, objectIdValidation, validate } = require('../middleware/validators');

const router = express.Router();

// All order routes require authentication
router.use(protect);

// User routes
router.post('/', createOrderValidation, validate, createOrder);
router.get('/', getMyOrders);
router.get('/:id', objectIdValidation, validate, getOrder);
router.put('/:id/cancel', objectIdValidation, validate, cancelOrder);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllOrders);
router.get('/admin/stats', authorize('admin'), getOrderStats);
router.put('/:id/status', authorize('admin'), objectIdValidation, validate, updateOrderStatus);

module.exports = router;
