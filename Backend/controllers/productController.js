const Product = require('../models/Product');
const { uploadToImageKit, deleteFromImageKit } = require('../utils/imagekit');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, priceMin, priceMax, ageRange, search } = req.query;
    
    let filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    if (ageRange) {
      filter.ageRange = ageRange;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true }).limit(6);

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, ageRange, sizes, stock, isFeatured, sizePrices } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    // Upload images to ImageKit
    const imageUrls = [];
    for (const file of req.files) {
      const uploadResult = await uploadToImageKit(file, 'products');
      if (uploadResult.success) {
        imageUrls.push(uploadResult.url);
      } else {
        return res.status(400).json({
          success: false,
          message: `Image upload failed: ${uploadResult.error}`
        });
      }
    }

    const productData = {
      name,
      description,
      price,
      category,
      ageRange,
      sizes: sizes ? JSON.parse(sizes) : undefined,
      stock,
      images: imageUrls,
      isFeatured: isFeatured === 'true'
    };

    // Add size-based prices if provided
    if (sizePrices) {
      productData.sizePrices = new Map(Object.entries(JSON.parse(sizePrices)));
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updateData = { ...req.body };

    if (updateData.sizes) {
      updateData.sizes = JSON.parse(updateData.sizes);
    }

    // Handle size-based prices if provided
    if (updateData.sizePrices) {
      updateData.sizePrices = new Map(Object.entries(JSON.parse(updateData.sizePrices)));
    }

    // Handle image uploads if files provided
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (const file of req.files) {
        const uploadResult = await uploadToImageKit(file, 'products');
        if (uploadResult.success) {
          imageUrls.push(uploadResult.url);
        }
      }
      updateData.images = imageUrls;
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle product featured status
// @route   PATCH /api/products/:id/toggle-featured
// @access  Private/Admin
exports.toggleFeatured = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product featured status updated',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
