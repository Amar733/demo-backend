const User = require('../models/User');
const { catchAsync } = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
exports.getAddresses = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('addresses');
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user.addresses
  });
});

// @desc    Add a new address
// @route   POST /api/users/addresses
// @access  Private
exports.addAddress = catchAsync(async (req, res, next) => {
  const { label, street, city, state, postalCode, country, isDefault } = req.body;

  // Validate required fields
  if (!street || !city || !state || !postalCode || !country) {
    return next(new ErrorResponse('Please provide all required address fields', 400));
  }

  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // If this is set as default, unset other defaults
  if (isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  // Create full address string
  const fullAddress = `${street}, ${city}, ${state} ${postalCode}, ${country}`;

  // Add new address
  const newAddress = {
    label: label || `Address ${user.addresses.length + 1}`,
    street,
    city,
    state,
    postalCode,
    country,
    fullAddress,
    isDefault: isDefault || user.addresses.length === 0 // First address is default
  };

  user.addresses.push(newAddress);
  await user.save();

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    data: user.addresses[user.addresses.length - 1]
  });
});

// @desc    Update an address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
exports.updateAddress = catchAsync(async (req, res, next) => {
  const { addressId } = req.params;
  const { label, street, city, state, postalCode, country, isDefault } = req.body;

  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const address = user.addresses.id(addressId);
  
  if (!address) {
    return next(new ErrorResponse('Address not found', 404));
  }

  // If setting as default, unset other defaults
  if (isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  // Update fields
  if (label !== undefined) address.label = label;
  if (street !== undefined) address.street = street;
  if (city !== undefined) address.city = city;
  if (state !== undefined) address.state = state;
  if (postalCode !== undefined) address.postalCode = postalCode;
  if (country !== undefined) address.country = country;
  if (isDefault !== undefined) address.isDefault = isDefault;

  // Update full address
  address.fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address updated successfully',
    data: address
  });
});

// @desc    Delete an address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
exports.deleteAddress = catchAsync(async (req, res, next) => {
  const { addressId } = req.params;

  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const address = user.addresses.id(addressId);
  
  if (!address) {
    return next(new ErrorResponse('Address not found', 404));
  }

  // Remove the address
  address.deleteOne();
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully'
  });
});

// @desc    Set default address
// @route   PUT /api/users/addresses/:addressId/set-default
// @access  Private
exports.setDefaultAddress = catchAsync(async (req, res, next) => {
  const { addressId } = req.params;

  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const address = user.addresses.id(addressId);
  
  if (!address) {
    return next(new ErrorResponse('Address not found', 404));
  }

  // Unset all defaults
  user.addresses.forEach(addr => {
    addr.isDefault = false;
  });

  // Set this as default
  address.isDefault = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Default address set successfully',
    data: address
  });
});
