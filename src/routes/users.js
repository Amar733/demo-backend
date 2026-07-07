const express = require('express');
const router = express.Router();
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getUserDetails
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Admin route to get detailed user info
router.get('/:userId/details', authorize('admin'), getUserDetails);

// Address routes
router.route('/addresses')
  .get(getAddresses)
  .post(addAddress);

router.route('/addresses/:addressId')
  .put(updateAddress)
  .delete(deleteAddress);

router.put('/addresses/:addressId/set-default', setDefaultAddress);

module.exports = router;
