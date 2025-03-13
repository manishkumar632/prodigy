const { MongoClient } = require('mongodb');
const { exec } = require('child_process');

// Function to check if MongoDB is running
async function checkMongoDBConnection() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);
  
  try {
    console.log('Checking MongoDB connection...');
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('✅ MongoDB is running!');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  } finally {
    await client.close();
  }
}

// Function to provide instructions based on OS
function provideInstructions() {
  const isWindows = process.platform === 'win32';
  
  console.log('\n📋 MongoDB Connection Instructions:');
  
  if (isWindows) {
    console.log(`
1. Make sure MongoDB is installed:
   - Download and install from https://www.mongodb.com/try/download/community

2. Start MongoDB service:
   - Run Command Prompt as Administrator
   - Run: net start MongoDB

3. Or use MongoDB Compass:
   - Download from https://www.mongodb.com/products/compass
   - Connect to mongodb://localhost:27017
    `);
  } else {
    console.log(`
1. Make sure MongoDB is installed:
   - macOS: brew install mongodb-community
   - Linux: Follow instructions at https://docs.mongodb.com/manual/administration/install-on-linux/

2. Start MongoDB service:
   - macOS: brew services start mongodb-community
   - Linux: sudo systemctl start mongod
    `);
  }
  
  console.log(`
Alternative: Use MongoDB Atlas (cloud):
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get your connection string
3. Update your .env.local file with the new connection string
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
  `);
}

// Main function
async function main() {
  const isConnected = await checkMongoDBConnection();
  
  if (!isConnected) {
    provideInstructions();
  }
}

main().catch(console.error); 