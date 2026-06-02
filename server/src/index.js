/**
 * @file server/src/index.js
 * @description Main entry point for RefineAI Express backend.
 * 
 * Responsibilities:
 * - Bootstraps Express + security middleware
 * - Mounts protected AI routes with rate limiting
 * - Starts the server
 * 
 * Environment variables required:
 *   PORT=4000
 *   FIREBASE_PROJECT_ID=your-project
 *   (See .env.example)
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai.js';

// Load environment
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ============================================
// Security & Middleware
// ============================================
app.use(helmet()); // Sets various security headers

// CORS — restrict in production!
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173']; // Vite default

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' })); // Resume text can be large

// Health check (no auth)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// Protected Routes (Rate Limited)
// ============================================
app.use('/api/ai', aiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'NotFound', message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err); // error log (kept intentionally)
  res.status(500).json({
    error: 'InternalServerError',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  });
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  console.log(`
  RefineAI Backend running
  Port: ${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  `);
});

export default app;
