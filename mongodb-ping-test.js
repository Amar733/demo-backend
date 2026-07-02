require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// Use the URI from .env file
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    console.log('🔍 Testing MongoDB Atlas connection...\n');
    console.log('URI:', uri.replace(/:[^:@]+@/, ':****@'));
    
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    
    console.log("\n✅ Pinged your deployment. You successfully connected to MongoDB!");
    
    // Test the ecommerce database
    const db = client.db("ecommerce");
    const collections = await db.listCollections().toArray();
    
    console.log('\n📦 Collections in ecommerce database:');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`   - ${col.name}: ${count} documents`);
    }
    
  } catch (error) {
    console.error('\n❌ Connection Error:', error.message);
    console.error('\n📋 Troubleshooting:');
    console.error('   1. Whitelist your IP in MongoDB Atlas → Network Access');
    console.error('   2. Verify credentials are correct');
    console.error('   3. Check if cluster is running (not paused)');
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
