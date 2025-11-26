import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';

export default (req: VercelRequest, res: VercelResponse) => {
  // Ensure we use cloud database for Vercel
  process.env.DB_ENV = 'cloud';
  return app(req, res);
};