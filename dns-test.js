const dns = require('dns').promises;

async function testDNS() {
  console.log('🔍 Testing DNS Resolution for MongoDB Atlas...\n');
  
  // Test SRV record
  try {
    console.log('Testing SRV record: _mongodb._tcp.cluster0.ngkkhhy.mongodb.net');
    const records = await dns.resolveSrv('_mongodb._tcp.cluster0.ngkkhhy.mongodb.net');
    console.log('✅ SRV Records found:', records.length);
    records.forEach(r => {
      console.log(`   ${r.name}:${r.port} (priority: ${r.priority})`);
    });
  } catch (error) {
    console.error('❌ SRV Resolution Failed:', error.code);
  }
  
  // Test A record
  try {
    console.log('\nTesting A record: cluster0.ngkkhhy.mongodb.net');
    const addresses = await dns.resolve4('cluster0.ngkkhhy.mongodb.net');
    console.log('✅ IP Addresses found:', addresses);
  } catch (error) {
    console.error('❌ A Record Resolution Failed:', error.code);
  }
  
  // Test with Google DNS
  console.log('\n📡 Testing with Google DNS (8.8.8.8)...');
  const resolver = new dns.Resolver();
  resolver.setServers(['8.8.8.8']);
  
  try {
    const records = await resolver.resolveSrv('_mongodb._tcp.cluster0.ngkkhhy.mongodb.net');
    console.log('✅ SRV Records (Google DNS):', records.length);
    records.forEach(r => {
      console.log(`   ${r.name}:${r.port}`);
    });
  } catch (error) {
    console.error('❌ Google DNS also failed:', error.code);
  }
}

testDNS().catch(console.error);
