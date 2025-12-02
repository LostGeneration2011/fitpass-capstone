import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import app from './app';
import setupWebSocket from './ws';

// Load environment variables
dotenv.config();

// Local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  
  // Create HTTP server for WebSocket integration
  const server = createServer(app);
  
  // Setup Socket.IO WebSocket
  setupWebSocket(server);
  
  // Setup simple WebSocket server on /ws path
  const wss = new WebSocketServer({ 
    server,
    path: '/ws'
  });

  wss.on('connection', (ws: any) => {
    console.log('🔌 Simple WebSocket client connected');
    
    ws.on('message', (message: any) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('📨 WebSocket message:', data);
        
        if (data.type === 'auth') {
          // Simple auth acknowledgment
          ws.send(JSON.stringify({ 
            type: 'auth_success', 
            message: 'Authentication successful' 
          }));
        }
      } catch (error) {
        console.log('📨 WebSocket raw message:', message.toString());
      }
    });

    ws.on('close', () => {
      console.log('🔌 Simple WebSocket client disconnected');
    });

    // Send welcome message
    ws.send(JSON.stringify({ 
      type: 'welcome', 
      message: 'Connected to FitPass WebSocket' 
    }));
  });
  
  server.listen(Number(PORT), () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.IO WebSocket ready`);
    console.log(`🔗 Simple WebSocket ready at /ws`);
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
