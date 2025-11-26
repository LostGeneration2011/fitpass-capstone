import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../src/config/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      service: 'fitpass-backend-api'
    });
  } catch (error) {
    console.error('API health check failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      service: 'fitpass-backend-api',
      error: 'Database connection failed'
    });
  }
}