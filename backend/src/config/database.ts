import mongoose from 'mongoose';

export const config = {
  database: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/fitpass',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  }
};

export const connectDatabase = async () => {
  try {
    await mongoose.connect(config.database.url, config.database.options);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};