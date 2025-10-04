const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: Number
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'US' }
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // Optional user reference for logged-in users
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    // Guest customer details (required for guest orders)
    customer: customerSchema,
    
    // Order number for tracking
    orderNumber: { 
      type: String, 
      unique: true,
      default: function() {
        return 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      }
    },
    
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    
    shippingAddress: { type: addressSchema, required: true },
    billingAddress: addressSchema,
    
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending'
    },
    
    paymentMethod: { 
      type: String, 
      enum: ['cod', 'card', 'paypal', 'stripe'], 
      default: 'cod' 
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentRef: String,
    
    notes: String,
    adminNotes: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);


