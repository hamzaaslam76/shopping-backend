const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    enum: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47']
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  colorCode: {
    type: String, // Hex color code
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }]
}, { _id: true });

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [120, 'Product title must be at most 120 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description must be at most 2000 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'Short description must be at most 500 characters']
  },
  
  // Pricing
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be >= 0']
  },
  oldPrice: {
    type: Number,
    min: [0, 'Old price must be >= 0']
  },
  currency: {
    type: String,
    default: 'PKR',
    enum: ['PKR', 'USD', 'EUR']
  },
  
  // Category and Classification
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product must belong to a category']
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex'],
    required: true
  },
  
  // Shoe-specific attributes
  brand: {
    type: String,
    required: true,
    trim: true
  },
  material: {
    type: String,
    enum: ['leather', 'canvas', 'synthetic', 'suede', 'mesh', 'rubber'],
    required: true
  },
  style: {
    type: String,
    enum: ['sneakers', 'heels', 'sandals', 'boots', 'flats', 'pumps', 'loafers', 'flip-flops', 'joggers'],
    required: true
  },
  heelHeight: {
    type: String,
    enum: ['flat', 'low (1-2 inches)', 'medium (2-3 inches)', 'high (3-4 inches)', 'very high (4+ inches)']
  },
  occasion: [{
    type: String,
    enum: ['casual', 'formal', 'sports', 'party', 'office', 'outdoor', 'wedding']
  }],
  
  // Product variants (size, color combinations)
  variants: [productVariantSchema],
  
  // Available sizes (for quick filtering)
  availableSizes: [{
    type: String,
    enum: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47']
  }],
  
  // Available colors (for quick filtering)
  availableColors: [{
    name: String,
    code: String // Hex code
  }],
  
  // Main product images (general product shots)
  mainImages: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Product status
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  
  // SEO and metadata
  metaTitle: String,
  metaDescription: String,
  tags: [String],
  
  // Ratings and reviews
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be above 0'],
    max: [5, 'Rating must be below or equal to 5']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  
  // Sales metrics
  totalSold: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  
  // Discount
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // Care instructions
  careInstructions: [String],
  
  // Shipping info
  weight: Number, // in grams
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discount calculation
productSchema.virtual('discount').get(function() {
  if (this.oldPrice && this.oldPrice > this.price) {
    return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
  }
  return this.discountPercentage || 0;
});

// Virtual for total stock
productSchema.virtual('totalStock').get(function() {
  if (!this.variants || !Array.isArray(this.variants)) {
    return 0;
  }
  return this.variants.reduce((total, variant) => total + (variant.stock || 0), 0);
});

// Indexes for better performance
productSchema.index({ category: 1, gender: 1, isActive: 1 });
productSchema.index({ style: 1, gender: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 });
productSchema.index({ 'variants.sku': 1 });

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);


