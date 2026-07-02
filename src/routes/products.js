const express = require('express');
const {
  getProducts,
  getProduct,
  getProductsByType,
  getProductsByCollection,
  getNewArrivals,
  getSpecialPricing,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const {
  createProductValidation,
  updateProductValidation,
  objectIdValidation,
  paginationValidation,
  validate
} = require('../middleware/validators');

const router = express.Router();

// Public routes
router.get('/', paginationValidation, validate, getProducts);
router.get('/filter/new-arrivals', getNewArrivals);
router.get('/filter/special-pricing', getSpecialPricing);
router.get('/type/:productType', getProductsByType);
router.get('/collection/:collection', getProductsByCollection);
router.get('/:id', objectIdValidation, validate, getProduct);

// Admin routes
router.post('/', protect, authorize('admin'), createProductValidation, validate, createProduct);
router.put('/:id', protect, authorize('admin'), objectIdValidation, updateProductValidation, validate, updateProduct);
router.delete('/:id', protect, authorize('admin'), objectIdValidation, validate, deleteProduct);
router.get('/stats/overview', protect, authorize('admin'), getProductStats);

module.exports = router;
