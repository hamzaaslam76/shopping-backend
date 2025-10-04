const Product = require('../Models/productModel');
const Category = require('../Models/categoryModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const emailService = require('../utils/emailService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for product images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = './public/uploads/products/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

exports.uploadProductImages = upload.fields([
  { name: 'mainImages', maxCount: 5 },
  { name: 'variantImages', maxCount: 10 }
]);

// Enhanced product creation with variants
exports.createProduct = catchAsync(async (req, res, next) => {
  let productData = { ...req.body };
  
  // Parse JSON fields if they come as strings
  if (typeof productData.variants === 'string') {
    productData.variants = JSON.parse(productData.variants);
  }
  if (typeof productData.availableColors === 'string') {
    productData.availableColors = JSON.parse(productData.availableColors);
  }
  if (typeof productData.availableSizes === 'string') {
    productData.availableSizes = JSON.parse(productData.availableSizes);
  }
  if (typeof productData.occasion === 'string') {
    productData.occasion = JSON.parse(productData.occasion);
  }
  if (typeof productData.tags === 'string') {
    productData.tags = JSON.parse(productData.tags);
  }
  if (typeof productData.careInstructions === 'string') {
    productData.careInstructions = JSON.parse(productData.careInstructions);
  }

  // Handle main images
  if (req.files && req.files.mainImages) {
    productData.mainImages = req.files.mainImages.map((file, index) => ({
      url: `/uploads/products/${file.filename}`,
      alt: file.originalname,
      isPrimary: index === 0
    }));
  }

  // Handle variant images
  if (req.files && req.files.variantImages && productData.variants) {
    const variantImages = req.files.variantImages.map(file => ({
      url: `/uploads/products/${file.filename}`,
      alt: file.originalname
    }));
    
    // Distribute images to variants (simple distribution)
    productData.variants.forEach((variant, index) => {
      if (variantImages[index]) {
        variant.images = [variantImages[index]];
      }
    });
  }

  const product = await Product.create(productData);
  
  // Send email notification for new product (optional - can be configured)
  try {
    // Get notification email from environment or use a default
    const notificationEmail = process.env.PRODUCT_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;
    
    if (notificationEmail) {
      // Populate category information for email
      const populatedProduct = await Product.findById(product._id).populate('category', 'name');
      
      await emailService.sendProductCreatedEmail(populatedProduct, notificationEmail);
      console.log(`Product created email sent to ${notificationEmail} for product: ${product.title}`);
    }
  } catch (emailError) {
    // Don't fail the product creation if email fails
    console.error('Failed to send product created email:', emailError);
  }
  
  res.status(201).json({
    status: 'success',
    data: {
      product
    }
  });
});

// Enhanced product update
exports.updateProduct = catchAsync(async (req, res, next) => {
  let updateData = { ...req.body };
  
  // Parse JSON fields
  ['variants', 'availableColors', 'availableSizes', 'occasion', 'tags', 'careInstructions'].forEach(field => {
    if (typeof updateData[field] === 'string') {
      try {
        updateData[field] = JSON.parse(updateData[field]);
      } catch (err) {
        // Keep as string if parsing fails
      }
    }
  });

  // Handle mainImages field - remove it from updateData if it's not properly formatted
  if (updateData.mainImages && typeof updateData.mainImages === 'string') {
    try {
      updateData.mainImages = JSON.parse(updateData.mainImages);
    } catch (err) {
      // If parsing fails, remove the field to avoid casting errors
      delete updateData.mainImages;
    }
  }

  // Handle new main images
  if (req.files && req.files.mainImages) {
    const newMainImages = req.files.mainImages.map((file, index) => ({
      url: `/uploads/products/${file.filename}`,
      alt: file.originalname,
      isPrimary: index === 0
    }));
    
    const existingProduct = await Product.findById(req.params.id);
    if (existingProduct && existingProduct.mainImages) {
      updateData.mainImages = [...existingProduct.mainImages, ...newMainImages];
    } else {
      updateData.mainImages = newMainImages;
    }
  }

  const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  }).populate('category');

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

// Get products with advanced filtering
exports.getProducts = catchAsync(async (req, res, next) => {
  // Build filter object
  let filter = {};
  
  // Filter by category
  if (req.query.category) {
    filter.category = req.query.category;
  }
  
  // Filter by gender
  if (req.query.gender) {
    filter.gender = req.query.gender;
  }
  
  // Filter by style
  if (req.query.style) {
    filter.style = req.query.style;
  }
  
  // Filter by brand
  if (req.query.brand) {
    filter.brand = new RegExp(req.query.brand, 'i');
  }
  
  // Filter by size
  if (req.query.size) {
    filter.availableSizes = { $in: [req.query.size] };
  }
  
  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }
  
  // Filter by active status
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  } else {
    filter.isActive = true; // Default to active products
  }

  // Execute query with API features
  const features = new APIFeatures(Product.find(filter).populate('category'), req.query)
    .filter()
    .sorts()
    .limitFields()
    .pagination();

  const products = await features.query;
  
  // Get total count for pagination
  const totalProducts = await Product.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    results: products.length,
    totalResults: totalProducts,
    data: {
      products
    }
  });
});

// Get single product with full details
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('category')
    .populate({
      path: 'reviews',
      select: 'rating comment user createdAt',
      populate: {
        path: 'user',
        select: 'name photo'
      }
    });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  // Increment view count
  await Product.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

// Get products by category
exports.getProductsByCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  
  const products = await Product.find({ 
    category: categoryId, 
    isActive: true 
  }).populate('category');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

// Get featured products
exports.getFeaturedProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({ 
    isFeatured: true, 
    isActive: true 
  }).populate('category').limit(8);

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

// Get new arrivals
exports.getNewArrivals = catchAsync(async (req, res, next) => {
  const products = await Product.find({ 
    isNewArrival: true, 
    isActive: true 
  }).populate('category').limit(8);

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

// Search products
exports.searchProducts = catchAsync(async (req, res, next) => {
  const { q } = req.query;
  
  if (!q) {
    return next(new AppError('Search query is required', 400));
  }

  const searchRegex = new RegExp(q, 'i');
  
  const products = await Product.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { brand: searchRegex },
          { style: searchRegex },
          { tags: { $in: [searchRegex] } }
        ]
      }
    ]
  }).populate('category');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

// Get product statistics (for dashboard)
exports.getProductStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        activeProducts: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        featuredProducts: {
          $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] }
        },
        averagePrice: { $avg: '$price' },
        totalStock: { $sum: '$totalStock' }
      }
    }
  ]);

  const categoryStats = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    {
      $unwind: '$category'
    },
    {
      $project: {
        categoryName: '$category.name',
        count: 1,
        avgPrice: { $round: ['$avgPrice', 2] }
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

exports.deleteProduct = factory.deleteOne(Product);


