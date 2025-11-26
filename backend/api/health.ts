import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../src/config/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      service: 'fitpass-backend'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      service: 'fitpass-backend',
      error: 'Database connection failed'
    });
  }
}