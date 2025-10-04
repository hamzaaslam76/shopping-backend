const Product = require('../Models/productModel');
const Category = require('../Models/categoryModel');
const Order = require('../Models/orderModel');
const Cart = require('../Models/cartModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const emailService = require('../utils/emailService');

// Get all products for customer app (public access)
exports.getCustomerProducts = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 20,
    sort = 'createdAt',
    order = 'desc',
    category,
    gender,
    minPrice,
    maxPrice,
    search,
    featured,
    newArrival
  } = req.query;

  // Build filter object
  let filter = { isActive: true };

  if (category) {
    filter.category = category;
  }

  if (gender) {
    filter.gender = gender;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseInt(minPrice);
    if (maxPrice) filter.price.$lte = parseInt(maxPrice);
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } }
    ];
  }

  if (featured === 'true') {
    filter.isFeatured = true;
  }

  if (newArrival === 'true') {
    filter.isNewArrival = true;
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build sort object
  const sortObj = {};
  sortObj[sort] = order === 'desc' ? -1 : 1;

  const products = await Product.find(filter)
    .populate('category', 'name')
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v -createdAt -updatedAt');

  const total = await Product.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: {
      products
    }
  });
});

// Get single product for customer app
exports.getCustomerProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name')
    .select('-__v -createdAt -updatedAt');

  if (!product || !product.isActive) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

// Get featured products for customer app
exports.getFeaturedProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({ 
    isActive: true, 
    isFeatured: true 
  })
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .limit(8)
    .select('-__v -createdAt -updatedAt');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

// Get new arrivals for customer app
exports.getNewArrivals = catchAsync(async (req, res, next) => {
  const products = await Product.find({ 
    isActive: true, 
    isNewArrival: true 
  })
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .limit(8)
    .select('-__v -createdAt -updatedAt');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

// Get products by category for customer app
exports.getProductsByCategory = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 20,
    sort = 'createdAt',
    order = 'desc',
    gender,
    minPrice,
    maxPrice
  } = req.query;

  // Build filter object
  let filter = { 
    isActive: true,
    category: req.params.categoryId 
  };

  if (gender) {
    filter.gender = gender;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseInt(minPrice);
    if (maxPrice) filter.price.$lte = parseInt(maxPrice);
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build sort object
  const sortObj = {};
  sortObj[sort] = order === 'desc' ? -1 : 1;

  const products = await Product.find(filter)
    .populate('category', 'name')
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v -createdAt -updatedAt');

  const total = await Product.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: {
      products
    }
  });
});

// Get categories for customer app
exports.getCustomerCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({ isActive: true })
    .populate('parent', 'name')
    .sort({ sortOrder: 1 })
    .select('-__v -createdAt -updatedAt');

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories
    }
  });
});

// Get featured categories for customer app
exports.getFeaturedCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({ 
    isActive: true, 
    isFeatured: true 
  })
    .populate('parent', 'name')
    .sort({ sortOrder: 1 })
    .select('-__v -createdAt -updatedAt');

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories
    }
  });
});

// Get recommended products for customer
exports.getRecommendedProducts = catchAsync(async (req, res, next) => {
  const { limit = 8, gender, category } = req.query;

  // Build filter for recommended products
  let filter = { isActive: true };
  
  if (gender) {
    filter.gender = gender;
  }
  
  if (category) {
    filter.category = category;
  }

  try {

    // Get recommended products based on:
    // 1. Featured products
    // 2. High-rated products (if reviews exist)
    // 3. Recent products
    // 4. Random products as fallback
    
    let recommendedProducts = [];

    // Try to get featured products first
    const featuredProducts = await Product.find({ 
      ...filter, 
      isFeatured: true 
    })
    .limit(parseInt(limit))
    .sort({ createdAt: -1 })
    .select('_id title price oldPrice discountPercentage mainImages availableSizes brand material style');

    recommendedProducts = featuredProducts;

    // If we don't have enough featured products, fill with recent products
    if (recommendedProducts.length < parseInt(limit)) {
      const remainingLimit = parseInt(limit) - recommendedProducts.length;
      const existingIds = recommendedProducts.map(p => p._id);
      
      const recentProducts = await Product.find({
        ...filter,
        _id: { $nin: existingIds }
      })
      .limit(remainingLimit)
      .sort({ createdAt: -1 })
      .select('_id title price oldPrice discountPercentage mainImages availableSizes brand material style');

      recommendedProducts = [...recommendedProducts, ...recentProducts];
    }

    // If still not enough, fill with random products
    if (recommendedProducts.length < parseInt(limit)) {
      const remainingLimit = parseInt(limit) - recommendedProducts.length;
      const existingIds = recommendedProducts.map(p => p._id);
      
      const randomProducts = await Product.aggregate([
        { $match: { ...filter, _id: { $nin: existingIds } } },
        { $sample: { size: remainingLimit } },
        { $project: { _id: 1, title: 1, price: 1, oldPrice: 1, discountPercentage: 1, mainImages: 1, availableSizes: 1, brand: 1, material: 1, style: 1 } }
      ]);

      recommendedProducts = [...recommendedProducts, ...randomProducts];
    }

    res.status(200).json({
      status: 'success',
      results: recommendedProducts.length,
      data: {
        products: recommendedProducts
      }
    });

  } catch (error) {
    console.error('Error fetching recommended products:', error);
    
    // Fallback to recent products if recommendation logic fails
    const fallbackProducts = await Product.find(filter)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .select('_id title price oldPrice discountPercentage mainImages availableSizes brand material style');

    res.status(200).json({
      status: 'success',
      results: fallbackProducts.length,
      data: {
        products: fallbackProducts
      }
    });
  }
});

// Create guest order (no authentication required)
exports.createGuestOrder = catchAsync(async (req, res, next) => {
  const {
    customerInfo,
    items,
    shippingAddress,
    paymentMethod,
    totalAmount,
    notes
  } = req.body;

  // Validate required fields
  if (!customerInfo || !items || !shippingAddress || !paymentMethod || !totalAmount) {
    return next(new AppError('Missing required order information', 400));
  }

  // Transform data to match Order model schema
  const orderData = {
    customer: {
      fullName: `${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`.trim() || customerInfo.email,
      email: customerInfo.email,
      phone: customerInfo.phone || shippingAddress.phone || ''
    },
    items: items.map(item => ({
      product: item.product,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      totalPrice: item.price * item.quantity
    })),
    subtotal: totalAmount,
    total: totalAmount,
    shippingAddress: {
      fullName: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim(),
      phone: shippingAddress.phone || '',
      addressLine1: shippingAddress.address || '',
      city: shippingAddress.city || '',
      country: shippingAddress.country || 'Pakistan'
    },
    paymentMethod: paymentMethod === 'cod' ? 'cod' : 'card',
    notes: notes || '',
    status: 'pending',
    paymentStatus: 'pending'
  };

  // Create order
  const order = await Order.create(orderData);

  // Send order confirmation email
  try {
    if (customerInfo.email) {
      await emailService.sendOrderConfirmationEmail(order, customerInfo.email);
      console.log(`Order confirmation email sent to ${customerInfo.email} for order: ${order._id}`);
    }
  } catch (emailError) {
    // Don't fail the order creation if email fails
    console.error('Failed to send order confirmation email:', emailError);
  }

  res.status(201).json({
    status: 'success',
    data: {
      order
    }
  });
});

// Get order by order number (for tracking)
exports.getOrderByNumber = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber })
    .populate('items.product', 'title price mainImages')
    .select('-__v -createdAt -updatedAt');

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

// Search products for customer app
exports.searchProducts = catchAsync(async (req, res, next) => {
  const {
    q,
    page = 1,
    limit = 20,
    sort = 'createdAt',
    order = 'desc',
    category,
    gender,
    minPrice,
    maxPrice
  } = req.query;

  if (!q) {
    return next(new AppError('Search query is required', 400));
  }

  // Build filter object
  let filter = { 
    isActive: true,
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } }
    ]
  };

  if (category) {
    filter.category = category;
  }

  if (gender) {
    filter.gender = gender;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseInt(minPrice);
    if (maxPrice) filter.price.$lte = parseInt(maxPrice);
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build sort object
  const sortObj = {};
  sortObj[sort] = order === 'desc' ? -1 : 1;

  const products = await Product.find(filter)
    .populate('category', 'name')
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v -createdAt -updatedAt');

  const total = await Product.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    query: q,
    data: {
      products
    }
  });
});

// Get product statistics for customer app
exports.getProductStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        totalSold: { $sum: '$totalSold' },
        totalViews: { $sum: '$viewCount' }
      }
    }
  ]);

  const categoryStats = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        averagePrice: { $avg: '$price' }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'categoryInfo'
      }
    },
    {
      $unwind: '$categoryInfo'
    },
    {
      $project: {
        categoryName: '$categoryInfo.name',
        count: 1,
        averagePrice: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: stats[0] || {},
      categoryStats
    }
  });
});

// Get Hac Foods products (dairy/food items)
exports.getHacFoodsProducts = catchAsync(async (req, res, next) => {
  const { limit = 6 } = req.query;

  try {
    // First find the "Hac Foods" and "Dairy Products" categories
    const categories = await Category.find({ 
      name: { $in: ['Hac Foods', 'Dairy Products'] } 
    }).select('_id name');

    const categoryIds = categories.map(cat => cat._id);

    // If no categories found, return empty result
    if (categoryIds.length === 0) {
      return res.status(200).json({
        status: 'success',
        results: 0,
        data: {
          products: []
        }
      });
    }

    // Find products in these categories
    const hacFoodsProducts = await Product.find({
      category: { $in: categoryIds },
      isActive: true
    })
    .populate('category', 'name')
    .select('_id title price oldPrice discountPercentage mainImages availableSizes brand material style variants stock')
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: hacFoodsProducts.length,
      data: {
        products: hacFoodsProducts
      }
    });

  } catch (error) {
    console.error('Error fetching Hac Foods products:', error);
    
    // Fallback to empty array if database query fails
    res.status(200).json({
      status: 'success',
      results: 0,
      data: {
        products: []
      }
    });
  }
});
