const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[\d\-\+\(\)\s]{10,}$/, 'Please provide a valid phone number']
    },
    shippingAddress: {
      street: {
        type: String,
        required: [true, 'Street address is required']
      },
      city: {
        type: String,
        required: [true, 'City is required']
      },
      state: {
        type: String,
        required: [true, 'State is required']
      },
      zip: {
        type: String,
        required: [true, 'ZIP code is required']
      }
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        name: String,
        size: String,
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: Number
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', OrderSchema);
