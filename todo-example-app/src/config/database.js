const { MongoClient } = require('mongodb');

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

let db;
let client;

async function connectDB() {
  try {
    client = new MongoClient(connectionString);
    await client.connect();
    console.log('Connected to MongoDB');
    
    db = client.db('todoapp');
    
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

async function closeDB() {
  if (client) {
    await client.close();
    console.log('Database connection closed');
  }
}

module.exports = {
  connectDB,
  closeDB,
  getDB: () => db
};