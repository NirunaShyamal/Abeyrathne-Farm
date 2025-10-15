// Serverless-compatible Express app and Mongo connection helper
// Reuses existing routes and controllers from the backend

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes (same as start-server.js)
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const eggProductionRoutes = require('./routes/eggProduction');
const salesOrderRoutes = require('./routes/salesOrder');
const feedInventoryRoutes = require('./routes/feedInventory');
const feedStockRoutes = require('./routes/feedStock');
const feedUsageRoutes = require('./routes/feedUsage');
const taskSchedulingRoutes = require('./routes/taskScheduling');
const financialRecordRoutes = require('./routes/financialRecord');
const contactRoutes = require('./routes/contact');

// Cache mongoose connection across invocations (Vercel best practice)
let cached = global.__mongoose;
if (!cached) {
  cached = global.__mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://codez:codez123@codez.7wxzojy.mongodb.net/farm_management?retryWrites=true&w=majority';
  const dbName = process.env.DB_NAME || 'farm_management';

  if (!cached.promise) {
    const options = {
      dbName,
      maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE) || 10,
      minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE) || 1,
      serverSelectionTimeoutMS: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 30000,
      socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT) || 45000,
      retryWrites: true,
      w: 'majority',
    };
    cached.promise = mongoose.connect(mongoUri, options).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

function createApp() {
  const app = express();

  // CORS configuration accepting localhost and Vercel preview/prod domains
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
        if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return callback(null, true);

        const allowed = [process.env.FRONTEND_URL].filter(Boolean);
        if (allowed.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.json({
      status: 'OK',
      message: 'Farm Management API (serverless) is running!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus,
      uptime: process.uptime(),
    });
  });

  // API routes (mounted under /api/*)
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/egg-production', eggProductionRoutes);
  app.use('/api/sales-orders', salesOrderRoutes);
  app.use('/api/feed-inventory', feedInventoryRoutes);
  app.use('/api/feed-stock', feedStockRoutes);
  app.use('/api/feed-usage', feedUsageRoutes);
  app.use('/api/task-scheduling', taskSchedulingRoutes);
  app.use('/api/financial-records', financialRecordRoutes);
  app.use('/api/contact', contactRoutes);

  // 404 handler for API
  app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: 'API endpoint not found' });
  });

  // Error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  });

  return app;
}

module.exports = { createApp, connectToDatabase };
