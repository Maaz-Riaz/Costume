const { body, validationResult } = require('express-validator');

// Validation middleware to handle errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Product validation rules
const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Superhero', 'Animal', 'Princess', 'Halloween', 'Occupation', 'Other'])
    .withMessage('Invalid category'),
  body('ageRange')
    .notEmpty()
    .withMessage('Age range is required')
    .isIn(['2-4', '4-6', '6-8', '8-10', '10-12', '12+'])
    .withMessage('Invalid age range'),
  body('stock')
    .notEmpty()
    .withMessage('Stock quantity is required')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative number')
];

// Order validation rules
const validateOrder = [
  body('customerName')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[\d\-\+\(\)\s]{10,}$/)
    .withMessage('Please provide a valid phone number'),
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.zip')
    .trim()
    .notEmpty()
    .withMessage('ZIP code is required'),
  body('items')
    .notEmpty()
    .withMessage('Items are required')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('totalAmount')
    .notEmpty()
    .withMessage('Total amount is required')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number')
];

// Admin login validation
const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

module.exports = {
  handleValidationErrors,
  validateProduct,
  validateOrder,
  validateLogin
};
