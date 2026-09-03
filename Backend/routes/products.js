const express = require('express');
const {
  getProducts,
  getFeaturedProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateProduct, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);
router.get('/', getProducts);

// Admin routes
router.post('/', protect, authorize('admin', 'superadmin'), upload.array('images', 5), validateProduct, handleValidationErrors, createProduct);
router.put('/:id', protect, authorize('admin', 'superadmin'), upload.array('images', 5), updateProduct);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteProduct);
router.patch('/:id/toggle-featured', protect, authorize('admin', 'superadmin'), toggleFeatured);

module.exports = router;
