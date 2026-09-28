const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/easyway';
  
  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${primaryUri}...`);
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('✅ [Database] MongoDB Connected Successfully to Live Database.');
  } catch (err) {
    console.warn(`⚠️ [Database] Standard MongoDB connection to ${primaryUri} failed: ${err.message}`);
    console.log('🔄 [Database] Initializing in-memory MongoDB fallback server for seamless local execution...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      console.log(`✅ [Database] In-memory MongoDB started at: ${memoryUri}`);
      await mongoose.connect(memoryUri);
      console.log('✅ [Database] Connected to embedded In-Memory MongoDB successfully.');
      
      // Auto-seed if memory server is used so the user gets instant data out of the box
      const seedDatabase = require('../seed/seedRunner');
      await seedDatabase();
    } catch (memErr) {
      console.error('❌ [Database] Fatal: Could not start in-memory MongoDB either:', memErr.message);
      throw memErr;
    }
  }
};

module.exports = connectDB;
