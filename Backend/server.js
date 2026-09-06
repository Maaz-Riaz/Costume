const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { initializeMailer } = require('./utils/nodemailer');

// Import routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const app = express();

// ===============================
// Middleware
// ===============================

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// Root Route
// ===============================

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Costume Store Backend API is running'
  });
});

// ===============================
// Initialize Nodemailer
// ===============================

initializeMailer();

// ===============================
// MongoDB Connection
// ===============================

mongoose
  .connect(
    process.env.MONGODB_URI ||
      'mongodb://localhost:27017/costume-store'
  )
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// ===============================
// API Routes
// ===============================

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', authRoutes);

// ===============================
// Health Check
// ===============================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// ===============================
// Error Handler
// ===============================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ===============================
// 404 Handler
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ===============================
// Local Development Only
// ===============================

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;