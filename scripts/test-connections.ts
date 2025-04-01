import fetch from 'node-fetch';

async function testConnections() {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    console.log('Testing connections...');
    console.log(`Base URL: ${baseUrl}`);
    
    const response = await fetch(`${baseUrl}/api/health`);
    const data = await response.json();
    
    console.log('\nHealth Check Results:');
    console.log('-------------------');
    
    if (data.status === 'healthy') {
      console.log('✅ Overall Status: Healthy\n');
      
      console.log('Database:');
      console.log(`  Connected: ${data.database.connected ? '✅ Yes' : '❌ No'}`);
      console.log(`  Timestamp: ${data.database.timestamp}\n`);
      
      console.log('Blob Storage:');
      console.log(`  Connected: ${data.blob.connected ? '✅ Yes' : '❌ No'}`);
      console.log(`  Total Blobs: ${data.blob.blobCount}`);
    } else {
      console.log('❌ Overall Status: Unhealthy');
      console.log(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Failed to run connection test:', error);
    process.exit(1);
  }
}

testConnections(); 