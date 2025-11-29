import dotenv from 'dotenv';
import { createServer } from 'http';
import app from './app';
import setupWebSocket from './ws';

// Load environment variables
dotenv.config();

// Local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  
  // Create HTTP server for WebSocket integration
  const server = createServer(app);
  
  // Setup WebSocket
  setupWebSocket(server);
  
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 WebSocket server ready`);
  });
} else {
  // For production deployment without WebSocket (if needed)
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Production server running on port ${PORT}`);
  });
}

// For Vercel
module.exports = app;
