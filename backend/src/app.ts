import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './routes/auth';
import userRouter from './routes/user.routes';
import classesRouter from './routes/classes.routes';
import sessionsRouter from './routes/sessions.routes';
import enrollmentsRouter from './routes/enrollments.routes';
import attendanceRouter from './routes/attendance.routes';
import qrRouter from './routes/qr.routes';
import { authMiddleware } from './middlewares/auth';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Root route
app.get('/', (_req, res) => {
  res.json({ 
    name: 'FitPass API', 
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api/*'
    }
  });
});

// health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes (no middleware needed)
app.use('/api/auth', authRouter);

// Protected routes with RBAC will be handled in individual route files
app.use('/api/users', authMiddleware, userRouter);
app.use('/api/classes', authMiddleware, classesRouter);
app.use('/api/sessions', authMiddleware, sessionsRouter);
app.use('/api/enrollments', authMiddleware, enrollmentsRouter);
app.use('/api/attendance', authMiddleware, attendanceRouter);
app.use('/api/qr', authMiddleware, qrRouter);

// Error handler must be last
app.use(errorHandler);

export default app;
