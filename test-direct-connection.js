require('dotenv').config();
const { MongoClient } = require('mongodb');

// Direct connection using the resolved hostnames (bypassing SRV)
const uri = 'mongodb://amar:Password18@ac-o0lwq10-shard-00-00.ngkkhhy.mongodb.net:27017,ac-o0lwq10-shard-00-01.ngkkhhy.mongodb.net:27017,ac-o0lwq10-shard-00-02.ngkkhhy.mongodb.net:27017/?ssl=true&authSource=admin&retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
});

async function test() {
  try {
    console.log('🔍 Testing direct connection (no SRV)...\n');
    
    await client.connect();
    console.log('✅ Connected!');
    
    const db = client.db('ecommerce');
    await db.command({ ping: 1 });
    console.log('✅ Pinged database successfully!');
    
    const collections = await db.listCollections().toArray();
    console.log('\n📦 Collections:');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`   - ${col.name}: ${count} documents`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

test();
