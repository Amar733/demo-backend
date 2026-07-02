require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

// Product data from frontend
const productsData = [
  // Perfumes
  {
    name: 'Ocean Breeze',
    description: 'Fresh aquatic scent perfect for summer',
    price: 6499,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    category: 'Fresh',
    stock: 35,
    productCollection: 'summer',
    gender: 'unisex',
    productType: 'perfume'
  },
  {
    name: 'Citrus Burst',
    description: 'Energizing blend of lemon, orange and bergamot',
    price: 5699,
    specialPrice: 4999,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=600&q=80',
    category: 'Citrus',
    stock: 60,
    productCollection: 'summer',
    gender: 'unisex',
    productType: 'perfume'
  },
  {
    name: 'Midnight Oud',
    description: 'Deep and mysterious oriental fragrance',
    price: 10799,
    image: 'https://images.unsplash.com/photo-1597070920565-32e67deeb4e8?auto=format&fit=crop&w=600&q=80',
    category: 'Oriental',
    stock: 20,
    productCollection: 'royal',
    gender: 'male',
    productType: 'perfume'
  },
  {
    name: 'Rose Champagne',
    description: 'Sparkling rose with champagne bubbles and peach',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1563170351-be823bc3f5f2?auto=format&fit=crop&w=600&q=80',
    category: 'Floral',
    stock: 37,
    gender: 'female',
    productType: 'perfume',
    isNewArrival: true
  },
  {
    name: 'Lavender Fields',
    description: 'Calming lavender with herbal undertones',
    price: 6199,
    specialPrice: 4999,
    image: 'https://images.unsplash.com/photo-1584044029317-fd272b49474b?auto=format&fit=crop&w=600&q=80',
    category: 'Floral',
    stock: 40,
    gender: 'unisex',
    productType: 'perfume'
  },
  {
    name: 'Black Orchid Dream',
    description: 'Sensual black orchid with dark chocolate and truffle',
    price: 11199,
    image: 'https://images.unsplash.com/photo-1593079834290-43aba9e5cc69?auto=format&fit=crop&w=600&q=80',
    category: 'Floral',
    stock: 24,
    gender: 'female',
    productType: 'perfume'
  },
  {
    name: 'Sandalwood Essence',
    description: 'Warm sandalwood with hints of vanilla and musk',
    price: 7499,
    image: 'https://images.unsplash.com/photo-1607346256330-dee4af15a9e0?auto=format&fit=crop&w=600&q=80',
    category: 'Woody',
    stock: 45,
    productCollection: 'royal',
    gender: 'male',
    productType: 'perfume',
    isNewArrival: true
  },
  {
    name: 'Jasmine Night',
    description: 'Exotic jasmine with amber and white musk',
    price: 7899,
    specialPrice: 6599,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80',
    category: 'Floral',
    stock: 32,
    gender: 'female',
    productType: 'perfume'
  },
  {
    name: 'Leather & Tobacco',
    description: 'Bold masculine scent with leather and tobacco notes',
    price: 9999,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
    category: 'Leather',
    stock: 28,
    productCollection: 'royal',
    gender: 'male',
    productType: 'perfume'
  },
  {
    name: 'Wild Berry Bliss',
    description: 'Sweet and fruity with blackberry and raspberry',
    price: 5399,
    image: 'https://images.unsplash.com/photo-1595394531850-301d4f98cc3b?auto=format&fit=crop&w=600&q=80',
    category: 'Fruity',
    stock: 55,
    productCollection: 'summer',
    gender: 'female',
    productType: 'perfume',
    isNewArrival: true
  },
  // Tea
  {
    name: 'Earl Grey Premium',
    description: 'Classic black tea infused with bergamot oil',
    price: 299,
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
    category: 'Black Tea',
    stock: 150,
    productType: 'tea',
    isNewArrival: true
  },
  {
    name: 'Green Tea Sencha',
    description: 'Japanese green tea with fresh, grassy notes',
    price: 399,
    image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=600&q=80',
    category: 'Green Tea',
    stock: 120,
    productType: 'tea'
  },
  {
    name: 'Chamomile Dreams',
    description: 'Soothing herbal tea for relaxation',
    price: 249,
    specialPrice: 199,
    image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=600&q=80',
    category: 'Herbal Tea',
    stock: 180,
    productType: 'tea'
  },
  {
    name: 'Jasmine Pearl Tea',
    description: 'Hand-rolled green tea pearls with jasmine flowers',
    price: 499,
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=600&q=80',
    category: 'Green Tea',
    stock: 95,
    productType: 'tea'
  },
  {
    name: 'Peppermint Fresh',
    description: 'Refreshing peppermint herbal tea',
    price: 199,
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=600&q=80',
    category: 'Herbal Tea',
    stock: 200,
    productType: 'tea'
  },
  // More Tea
  {
    name: 'Oolong Golden',
    description: 'Semi-oxidized tea with complex flavor',
    price: 449,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=600&q=80',
    category: 'Oolong Tea',
    stock: 110,
    productType: 'tea',
    isNewArrival: true
  },
  {
    name: 'English Breakfast',
    description: 'Robust black tea blend perfect for mornings',
    price: 349,
    image: 'https://images.unsplash.com/photo-1584302179602-e6d44cd91da7?auto=format&fit=crop&w=600&q=80',
    category: 'Black Tea',
    stock: 165,
    productType: 'tea'
  },
  {
    name: 'White Peony Tea',
    description: 'Delicate white tea with subtle sweetness',
    price: 549,
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
    category: 'White Tea',
    stock: 80,
    productType: 'tea',
    isNewArrival: true
  },
  {
    name: 'Masala Chai',
    description: 'Spiced Indian tea with cardamom, cinnamon, and ginger',
    price: 349,
    specialPrice: 299,
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b14537f7b?auto=format&fit=crop&w=600&q=80',
    category: 'Black Tea',
    stock: 145,
    productType: 'tea'
  },
  {
    name: 'Matcha Premium',
    description: 'Ceremonial grade Japanese matcha powder',
    price: 699,
    image: 'https://images.unsplash.com/photo-1591782452984-5d1e5db0d7b6?auto=format&fit=crop&w=600&q=80',
    category: 'Green Tea',
    stock: 70,
    productType: 'tea',
    isNewArrival: true
  },
  // Coffee
  {
    name: 'Ethiopian Yirgacheffe',
    description: 'Light roast with floral and citrus notes, single origin',
    price: 499,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
    category: 'Light Roast',
    stock: 140,
    productType: 'coffee',
    isNewArrival: true
  },
  {
    name: 'Colombian Supremo',
    description: 'Medium roast with smooth, balanced flavor and nutty undertones',
    price: 449,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
    category: 'Medium Roast',
    stock: 180,
    productType: 'coffee'
  },
  {
    name: 'Italian Dark Roast',
    description: 'Bold and intense espresso blend with dark chocolate notes',
    price: 399,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    category: 'Dark Roast',
    stock: 160,
    productType: 'coffee'
  },
  {
    name: 'Vanilla Caramel Coffee',
    description: 'Smooth coffee with vanilla and caramel flavor infusion',
    price: 479,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    category: 'Flavored',
    stock: 130,
    productType: 'coffee',
    isNewArrival: true
  },
  {
    name: 'Decaf House Blend',
    description: 'Full-bodied decaffeinated coffee blend, perfect anytime',
    price: 429,
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&q=80',
    category: 'Decaf',
    stock: 95,
    productType: 'coffee'
  },
  // Powerbanks
  {
    name: 'MagSafe Power Bank 5000mAh',
    description: 'Magnetic wireless charging power bank for iPhone',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80',
    category: 'Magnetic (MagSafe-compatible)',
    stock: 85,
    productType: 'powerbank',
    isNewArrival: true
  },
  {
    name: 'Ultra Slim Power Bank 20000mAh',
    description: 'High capacity portable charger in slim design',
    price: 3999,
    specialPrice: 3499,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80',
    category: 'Slim travel power banks',
    stock: 75,
    productType: 'powerbank'
  },
  {
    name: 'Heavy Duty Power Bank 30000mAh',
    description: 'Maximum capacity for multiple device charging',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80',
    category: 'High-capacity (20,000mAh+)',
    stock: 60,
    productType: 'powerbank',
    isNewArrival: true
  },
  // Earbuds
  {
    name: 'Budget Wireless Earbuds',
    description: 'Affordable true wireless earbuds with great sound',
    price: 1999,
    specialPrice: 1599,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    category: 'Budget',
    stock: 200,
    productType: 'earbuds'
  },
  {
    name: 'Gaming Earbuds Pro',
    description: 'Low latency gaming earbuds with immersive sound',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    category: 'Gaming',
    stock: 90,
    productType: 'earbuds',
    isNewArrival: true
  },
  {
    name: 'ANC Pro Earbuds',
    description: 'Active noise cancellation with transparency mode',
    price: 6999,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    category: 'ANC (Active Noise Cancellation)',
    stock: 80,
    productType: 'earbuds'
  },
  {
    name: 'Sports Waterproof Earbuds',
    description: 'IPX7 waterproof earbuds perfect for workouts',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    category: 'Sports',
    stock: 110,
    productType: 'earbuds'
  },
  {
    name: 'Premium Hi-Fi Earbuds',
    description: 'Audiophile-grade wireless earbuds with premium sound',
    price: 9999,
    specialPrice: 8499,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    category: 'Premium wireless',
    stock: 55,
    productType: 'earbuds',
    isNewArrival: true
  },
  // Toys
  {
    name: 'STEM Building Blocks Set',
    description: 'Educational building set for creative learning',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=600&q=80',
    category: 'Educational',
    stock: 85,
    productType: 'toy',
    isNewArrival: true
  },
  {
    name: 'Plush Teddy Bear',
    description: 'Soft and cuddly teddy bear for all ages',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1551119972-94d64c7e3e97?auto=format&fit=crop&w=600&q=80',
    category: 'Plush',
    stock: 150,
    productType: 'toy'
  },
  {
    name: '3D Puzzle Set',
    description: 'Challenging 3D puzzle for brain development',
    price: 1799,
    specialPrice: 1499,
    image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=80',
    category: 'Puzzle',
    stock: 95,
    productType: 'toy'
  },
  {
    name: 'RC Racing Car',
    description: 'Fast remote control racing car with LED lights',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=600&q=80',
    category: 'Remote Control',
    stock: 70,
    productType: 'toy',
    isNewArrival: true
  },
  {
    name: 'Art & Craft Kit',
    description: 'Complete creative kit for young artists',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=600&q=80',
    category: 'Creative',
    stock: 120,
    productType: 'toy'
  },
  // Accessories
  {
    name: 'Premium Cotton Scarf',
    description: 'Soft breathable cotton scarf for all seasons',
    price: 799,
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80',
    category: 'Cotton',
    stock: 100,
    productType: 'accessory'
  },
  {
    name: 'Luxury Silk Scarf',
    description: 'Elegant silk scarf with floral print',
    price: 1999,
    specialPrice: 1699,
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80',
    category: 'Silk',
    stock: 65,
    productType: 'accessory',
    isNewArrival: true
  },
  {
    name: 'Linen Summer Scarf',
    description: 'Lightweight linen scarf perfect for summer',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80',
    category: 'Linen',
    stock: 85,
    productType: 'accessory'
  },
  // Bottles
  {
    name: 'Insulated Steel Bottle 500ml',
    description: 'Keeps drinks hot or cold for 24 hours',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    category: 'Insulated',
    stock: 140,
    productType: 'bottle',
    isNewArrival: true
  },
  {
    name: 'Glass Water Bottle 750ml',
    description: 'Eco-friendly borosilicate glass bottle',
    price: 899,
    specialPrice: 749,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    category: 'Glass',
    stock: 115,
    productType: 'bottle'
  },
  {
    name: 'Sports Bottle 1L',
    description: 'BPA-free sports bottle with flip cap',
    price: 599,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    category: 'Sports',
    stock: 180,
    productType: 'bottle'
  },
  {
    name: 'Smart Temperature Bottle',
    description: 'LED display shows drink temperature',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    category: 'Smart',
    stock: 70,
    productType: 'bottle',
    isNewArrival: true
  },
  {
    name: 'Collapsible Travel Bottle',
    description: 'Space-saving collapsible silicone bottle',
    price: 799,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    category: 'Travel',
    stock: 95,
    productType: 'bottle'
  },
  // Study Supplies
  {
    name: 'Premium Notebook Set',
    description: 'Set of 3 hardcover notebooks with quality paper',
    price: 799,
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80',
    category: 'Notebooks',
    stock: 200,
    productType: 'study'
  },
  {
    name: 'Gel Pen Set 12-Pack',
    description: 'Smooth writing gel pens in assorted colors',
    price: 399,
    specialPrice: 299,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    category: 'Pens',
    stock: 250,
    productType: 'study'
  },
  {
    name: 'Electronic Calculator',
    description: 'Scientific calculator for students',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1611532736570-a8f8b3e9d33f?auto=format&fit=crop&w=600&q=80',
    category: 'Electronics',
    stock: 130,
    productType: 'study',
    isNewArrival: true
  },
  {
    name: 'Highlighter Set',
    description: 'Pack of 6 fluorescent highlighters',
    price: 249,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    category: 'Highlighters',
    stock: 220,
    productType: 'study'
  },
  {
    name: 'Monthly Planner 2024',
    description: 'Organize your schedule with this elegant planner',
    price: 899,
    specialPrice: 699,
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80',
    category: 'Planners',
    stock: 145,
    productType: 'study',
    isNewArrival: true
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Seed database
const seedDB = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Insert products
    await Product.insertMany(productsData);
    console.log(`✅ Inserted ${productsData.length} products`);

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      mobile: '9999999999',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✅ Created admin user (Email: admin@ecommerce.com, Mobile: 9999999999, Password: admin123)');

    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@ecommerce.com',
      mobile: '8888888888',
      password: 'test123'
    });
    console.log('✅ Created test user (Email: test@ecommerce.com, Mobile: 8888888888, Password: test123)');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(() => seedDB());
