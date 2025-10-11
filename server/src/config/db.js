import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Connection pool configuration
      maxPoolSize: 50,
      minPoolSize: 10,
      maxIdleTimeMS: 10000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });

    // Set default query timeout for all queries (30 seconds)
    mongoose.set('maxTimeMS', 30000);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    console.log(`🔗 Connection Pool: Min ${conn.connection.client.options.minPoolSize}, Max ${conn.connection.client.options.maxPoolSize}`);
    console.log(`⏱️  Query Timeout: 30 seconds`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

