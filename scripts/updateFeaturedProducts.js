const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../Models/productModel');

// Load environment variables
dotenv.config({ path: './config.env' });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const updateFeaturedProducts = async () => {
  try {
    await connectDB();
    
    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);
    
    // Update first 5 products to be featured
    const featuredCount = Math.min(5, products.length);
    const featuredProducts = products.slice(0, featuredCount);
    
    for (let i = 0; i < featuredProducts.length; i++) {
      await Product.findByIdAndUpdate(featuredProducts[i]._id, {
        isFeatured: true,
        isNewArrival: i < 3 // First 3 are also new arrivals
      });
      console.log(`Updated product ${i + 1}: ${featuredProducts[i].title} - Featured: true`);
    }
    
    // Verify the updates
    const featuredProductsCount = await Product.countDocuments({ isFeatured: true });
    const newArrivalsCount = await Product.countDocuments({ isNewArrival: true });
    
    console.log(`\n✅ Update completed!`);
    console.log(`📊 Featured products: ${featuredProductsCount}`);
    console.log(`📊 New arrivals: ${newArrivalsCount}`);
    
    // Show some featured products
    const featuredProductsList = await Product.find({ isFeatured: true })
      .select('title price isFeatured isNewArrival')
      .limit(5);
    
    console.log(`\n🌟 Featured Products:`);
    featuredProductsList.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - $${product.price} (Featured: ${product.isFeatured}, New: ${product.isNewArrival})`);
    });
    
  } catch (error) {
    console.error('Error updating featured products:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the script
updateFeaturedProducts();
