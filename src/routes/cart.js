const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const { addToCartValidation, validate } = require('../middleware/validators');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.route('/')
  .get(getCart)
  .post(addToCartValidation, validate, addToCart)
  .delete(clearCart);

router.route('/:productId')
  .put(updateCartItem)
  .delete(removeFromCart);

module.exports = router;
