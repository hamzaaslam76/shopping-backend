const Order = require('../Models/orderModel');
const Product = require('../Models/productModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all orders with population
exports.getOrders = factory.getAll(Order);

// Get single order with full details
exports.getOrder = factory.getOne(Order, { path: 'items.product user' });

// Create guest order (no login required)
exports.createGuestOrder = catchAsync(async (req, res, next) => {
  const { customer, items, shippingAddress, billingAddress, paymentMethod, notes } = req.body;

  // Validate and calculate order totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new AppError(`Product with ID ${item.product} not found`, 404));
    }
    
    if (product.stock < item.quantity) {
      return next(new AppError(`Insufficient stock for ${product.title}`, 400));
    }

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      product: product._id,
      title: product.title,
      price: product.price,
      quantity: item.quantity,
      totalPrice: itemTotal
    });
  }

  // Calculate totals (you can add tax and shipping logic here)
  const shippingCost = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;

  // Create order
  const order = await Order.create({
    customer,
    items: orderItems,
    subtotal,
    shippingCost,
    tax,
    total,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    paymentMethod,
    notes
  });

  // Update product stock
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
    });
  }

  await order.populate('items.product');

  res.status(201).json({
    status: 'success',
    data: {
      order
    }
  });
});

// Update order status (admin only)
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status, paymentStatus, adminNotes } = req.body;
  
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { 
      status, 
      paymentStatus,
      adminNotes,
      ...(status === 'delivered' && { deliveredAt: new Date() })
    },
    { new: true, runValidators: true }
  ).populate('items.product');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

// Get order by order number (for customer tracking)
exports.getOrderByNumber = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber })
    .populate('items.product');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

// Get orders by status (for admin dashboard)
exports.getOrdersByStatus = catchAsync(async (req, res, next) => {
  const { status } = req.params;
  
  const orders = await Order.find({ status })
    .populate('items.product')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

// Standard CRUD operations
exports.createOrder = factory.create(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);


