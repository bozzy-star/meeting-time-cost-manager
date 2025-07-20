import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import * as process from 'process';
import authRoutes from './routes/auth';
import meetingRoutes from './routes/meetings';
import participantRoutes from './routes/participants';
import { authenticateToken, AuthenticatedRequest } from './middleware/auth';

// Load environment variables
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 8000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'OK',
      message: 'Meeting TimeValue Pro API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: 'disconnected'
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/meetings', participantRoutes);

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Meeting TimeValue Pro API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        logout: 'POST /api/auth/logout',
        profile: 'GET /api/auth/profile',
        refresh: 'POST /api/auth/refresh'
      },
      meetings: {
        list: 'GET /api/meetings',
        create: 'POST /api/meetings',
        get: 'GET /api/meetings/:id',
        update: 'PUT /api/meetings/:id',
        delete: 'DELETE /api/meetings/:id',
        start: 'POST /api/meetings/:id/start',
        end: 'POST /api/meetings/:id/end',
        participants: {
          list: 'GET /api/meetings/:id/participants',
          add: 'POST /api/meetings/:id/participants',
          update: 'PUT /api/meetings/:id/participants/:participantId',
          remove: 'DELETE /api/meetings/:id/participants/:participantId',
          join: 'POST /api/meetings/:id/participants/:participantId/join',
          leave: 'POST /api/meetings/:id/participants/:participantId/leave'
        }
      },
      users: {
        profile: 'GET /api/users/profile',
        update: 'PUT /api/users/profile'
      }
    }
  });
});

// Protected routes example
app.get('/api/protected', authenticateToken, (req: AuthenticatedRequest, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user
  });
});

// Legacy meeting endpoint (redirects to new route)
app.get('/api/meetings-legacy', authenticateToken, async (req, res) => {
  res.redirect('/api/meetings');
});

// Legacy endpoints removed - now handled by routes

// User routes placeholder
app.get('/api/users/profile', (req, res) => {
  res.json({
    message: 'User profile endpoint - Coming soon',
    status: 'not_implemented'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
      timestamp: new Date().toISOString()
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'Endpoint not found',
      status: 404,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString()
    }
  });
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('\n🔄 Gracefully shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Gracefully shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Meeting TimeValue Pro API Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📖 API documentation: http://localhost:${PORT}/api`);
  console.log(`🗄️ Database: Connected to SQLite`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;