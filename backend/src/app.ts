import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { prisma } from './config/prisma';
import { getConnectionInfo } from './config/database-config';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import debugRoutes from './routes/debug.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/debug', debugRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'FitPass Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      apiHealth: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      debug: '/api/debug'
    },
    documentation: 'https://github.com/LostGeneration2011/fitpass-capstone'
  });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    const dbInfo = getConnectionInfo();
    
    res.status(200).json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        environment: dbInfo.environment,
        provider: dbInfo.provider,
        isLocal: dbInfo.isLocal
      },
      service: 'fitpass-backend'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    const dbInfo = getConnectionInfo();
    
    res.status(500).json({ 
      status: 'error',
      timestamp: new Date().toISOString(),
      database: {
        status: 'disconnected',
        environment: dbInfo.environment,
        provider: dbInfo.provider,
        isLocal: dbInfo.isLocal
      },
      service: 'fitpass-backend',
      error: 'Database connection failed'
    });
  }
});

// API Health check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const dbInfo = getConnectionInfo();
    
    res.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        environment: dbInfo.environment,
        provider: dbInfo.provider,
        isLocal: dbInfo.isLocal
      },
      service: 'fitpass-backend'
    });
  } catch (error) {
    console.error('API health check failed:', error);
    const dbInfo = getConnectionInfo();
    
    res.status(500).json({ 
      status: 'error',
      timestamp: new Date().toISOString(),
      database: {
        status: 'disconnected',
        environment: dbInfo.environment,
        provider: dbInfo.provider,
        isLocal: dbInfo.isLocal
      },
      service: 'fitpass-backend',
      error: 'Database connection failed'
    });
  }
});

export default app;