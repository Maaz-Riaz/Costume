const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative']
    },
    sizePrices: {
      type: Map,
      of: Number,
      default: null
    },
    category: {
      type: String,
      enum: ['Superhero', 'Animal', 'Princess', 'Halloween', 'Occupation', 'Other'],
      required: [true, 'Please select a category']
    },
    ageRange: {
      type: String,
      enum: ['2-4', '4-6', '6-8', '8-10', '10-12', '12+'],
      required: [true, 'Please specify age range']
    },
    sizes: {
      type: [String],
      required: true,
      default: ['XS', 'S', 'M', 'L', 'XL']
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock cannot be negative']
    },
    images: {
      type: [String], // ImageKit URLs
      required: [true, 'Please provide at least one image'],
      validate: {
        validator: function(arr) {
          return arr && arr.length > 0;
        },
        message: 'At least one image is required'
      }
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', ProductSchema);
