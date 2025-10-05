const Category = require('../Models/categoryModel');
const Product = require('../Models/productModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const pinataService = require('../utils/pinataService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for category images (memory storage for Pinata upload)
const upload = multer({ 
  storage: multer.memoryStorage(), // Store in memory for Pinata upload
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit (increased for IPFS)
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

exports.uploadCategoryImage = upload.single('image');

// Enhanced category creation with Pinata IPFS upload
exports.createCategory = catchAsync(async (req, res, next) => {
  let categoryData = { ...req.body };
  
  // Handle image upload to Pinata IPFS
  if (req.file) {
    try {
      const uploadResult = await pinataService.uploadFile(req.file, {
        name: `category_${Date.now()}_${req.file.originalname}`,
        type: 'category-image',
        metadata: {
          categoryName: categoryData.name || 'Unknown',
          uploadedBy: req.user?.id || 'system'
        }
      });

      categoryData.image = {
        url: uploadResult.url,
        ipfsHash: uploadResult.ipfsHash,
        alt: req.file.originalname,
        uploadedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Pinata upload failed:', error);
      return next(new AppError('Failed to upload image to IPFS', 500));
    }
  }

  const category = await Category.create(categoryData);
  
  res.status(201).json({
    status: 'success',
    data: {
      category
    }
  });
});

// Enhanced category update with Pinata IPFS upload
exports.updateCategory = catchAsync(async (req, res, next) => {
  let updateData = { ...req.body };
  
  // Handle image field - remove it from updateData if it's not properly formatted
  if (updateData.image && typeof updateData.image === 'string') {
    try {
      updateData.image = JSON.parse(updateData.image);
    } catch (err) {
      // If parsing fails, remove the field to avoid casting errors
      delete updateData.image;
    }
  }
  
  // Handle new image upload to Pinata IPFS
  if (req.file) {
    try {
      // Get existing category to preserve current image info
      const existingCategory = await Category.findById(req.params.id);
      
      const uploadResult = await pinataService.uploadFile(req.file, {
        name: `category_${req.params.id}_${Date.now()}_${req.file.originalname}`,
        type: 'category-image',
        metadata: {
          categoryId: req.params.id,
          categoryName: updateData.name || existingCategory?.name || 'Unknown',
          uploadedBy: req.user?.id || 'system',
          isUpdate: true
        }
      });

      updateData.image = {
        url: uploadResult.url,
        ipfsHash: uploadResult.ipfsHash,
        alt: req.file.originalname,
        uploadedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Pinata upload failed:', error);
      return next(new AppError('Failed to upload image to IPFS', 500));
    }
  }

  const category = await Category.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      category
    }
  });
});

// Get categories with hierarchy
exports.getCategories = catchAsync(async (req, res, next) => {
  let filter = {};
  
  // Filter by gender
  if (req.query.gender) {
    filter.gender = req.query.gender;
  }
  
  // Filter by active status
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  } else {
    filter.isActive = true; // Default to active categories
  }
  
  // Filter by parent (for subcategories)
  if (req.query.parent) {
    filter.parent = req.query.parent;
  }

  const categories = await Category.find(filter)
    .populate('parent', 'name slug')
    .populate('subcategories')
    .sort({ sortOrder: 1, name: 1 });

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories
    }
  });
});

// Get single category with products
exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id)
    .populate('parent', 'name slug')
    .populate('subcategories');

  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  // Get products in this category
  const products = await Product.find({ 
    category: req.params.id, 
    isActive: true 
  }).limit(10);

  res.status(200).json({
    status: 'success',
    data: {
      category,
      products
    }
  });
});

// Get featured categories
exports.getFeaturedCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({ 
    isFeatured: true, 
    isActive: true 
  }).sort({ sortOrder: 1 });

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories
    }
  });
});

// Get categories by gender
exports.getCategoriesByGender = catchAsync(async (req, res, next) => {
  const { gender } = req.params;
  
  const categories = await Category.find({ 
    gender: gender, 
    isActive: true 
  }).sort({ sortOrder: 1, name: 1 });

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories
    }
  });
});

// Get category statistics
exports.getCategoryStats = catchAsync(async (req, res, next) => {
  const stats = await Category.aggregate([
    {
      $group: {
        _id: null,
        totalCategories: { $sum: 1 },
        activeCategories: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        featuredCategories: {
          $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] }
        }
      }
    }
  ]);

  const genderStats = await Category.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$gender',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get product count per category
  const categoryProductCounts = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        productCount: { $sum: 1 }
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
        productCount: 1
      }
    },
    { $sort: { productCount: -1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: stats[0] || {},
      genderStats,
      categoryProductCounts
    }
  });
});

exports.deleteCategory = factory.deleteOne(Category);


