import dotenv from 'dotenv';
import app from './app';

// Load environment variables
dotenv.config();

// Local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Local server running on port ${PORT}`);
  });
}

// For Vercel
module.exports = app;
