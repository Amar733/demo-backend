require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');

async function fixProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check how many products exist
    const totalProducts = await Product.countDocuments();
    console.log(`📦 Found ${totalProducts} total products in database`);

    // Check how many are active
    const activeProducts = await Product.countDocuments({ isActive: true });
    console.log(`✅ ${activeProducts} products are active`);

    // Check how many are inactive or missing isActive field
    const inactiveProducts = await Product.countDocuments({ 
      $or: [
        { isActive: false },
        { isActive: { $exists: false } }
      ]
    });
    console.log(`❌ ${inactiveProducts} products are inactive or missing isActive field`);

    // Update all products to be active
    const result = await Product.updateMany(
      { 
        $or: [
          { isActive: false },
          { isActive: { $exists: false } }
        ]
      },
      { $set: { isActive: true } }
    );

    console.log(`\n🔧 Updated ${result.modifiedCount} products to isActive: true`);

    // Verify the fix
    const newActiveCount = await Product.countDocuments({ isActive: true });
    console.log(`✅ Now ${newActiveCount} products are active`);

    // Show sample products
    const sampleProducts = await Product.find({ isActive: true }).limit(3).select('name price isActive');
    console.log('\n📋 Sample products:');
    sampleProducts.forEach(p => {
      console.log(`  - ${p.name} (₹${p.price}) - Active: ${p.isActive}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixProducts();
