import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../src/config/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Force cloud database for Vercel
  process.env.DB_ENV = 'cloud';
  
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        environment: 'cloud',
        provider: 'postgresql',
        isLocal: false
      },
      service: 'fitpass-backend',
      platform: 'vercel'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: {
        status: 'disconnected',
        environment: 'cloud',
        provider: 'postgresql',
        isLocal: false
      },
      service: 'fitpass-backend',
      platform: 'vercel',
      error: 'Database connection failed'
    });
  }
}