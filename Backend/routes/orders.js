const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { validateOrder, handleValidationErrors } = require('../middleware/validation');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limit for creating orders (prevent spam)
const createOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: 'Too many order requests, please try again later'
});

// Public route to create order
router.post('/', createOrderLimiter, validateOrder, handleValidationErrors, createOrder);

// Admin routes
router.get('/stats/overview', protect, authorize('admin', 'superadmin'), getOrderStats);
router.get('/', protect, authorize('admin', 'superadmin'), getOrders);
router.get('/:id', protect, authorize('admin', 'superadmin'), getOrder);
router.patch('/:id/status', protect, authorize('admin', 'superadmin'), updateOrderStatus);

module.exports = router;
