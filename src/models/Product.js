const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price cannot be negative']
  },
  specialPrice: {
    type: Number,
    min: [0, 'Special price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Please provide product image URL']
  },
  images: [{
    type: String
  }],
  category: {
    type: String,
    required: [true, 'Please provide product category']
  },
  productType: {
    type: String,
    required: [true, 'Please provide product type'],
    enum: ['perfume', 'tea', 'coffee', 'powerbank', 'earbuds', 'toy', 'accessory', 'bottle', 'study']
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  collection: {
    type: String,
    enum: ['summer', 'royal', 'new-arrivals', 'special-pricing']
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unisex']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ productType: 1, category: 1 });
ProductSchema.index({ isNewArrival: 1 });
ProductSchema.index({ collection: 1 });

// Virtual for checking if product is on sale
ProductSchema.virtual('isOnSale').get(function() {
  return this.specialPrice && this.specialPrice < this.price;
});

// Virtual for discount percentage
ProductSchema.virtual('discountPercentage').get(function() {
  if (this.specialPrice && this.specialPrice < this.price) {
    return Math.round(((this.price - this.specialPrice) / this.price) * 100);
  }
  return 0;
});

// Ensure virtuals are included in JSON
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', ProductSchema);
