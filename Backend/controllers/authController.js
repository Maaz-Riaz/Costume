const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for admin
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(admin._id, admin.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Register admin (only for initial setup - should be restricted)
// @route   POST /api/admin/register
// @access  Private
exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if admin already exists
    let admin = await Admin.findOne({ email });

    if (admin) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists'
      });
    }

    admin = await Admin.create({
      email,
      password,
      role: role || 'admin'
    });

    const token = generateToken(admin._id, admin.role);

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current admin
// @route   GET /api/admin/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
