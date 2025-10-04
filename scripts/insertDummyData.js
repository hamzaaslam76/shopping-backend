const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const Category = require('../Models/categoryModel');
const Product = require('../Models/productModel');

// Import dummy data
const dummyCategories = require('../data/dummyCategories');
const dummyProducts = require('../data/dummyProducts');

// MongoDB connection
const connectDB = async () => {
  try {
    // Debug environment variables
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('DATABASE:', process.env.DATABASE);
    console.log('LOCAL_DATABASE:', process.env.LOCAL_DATABASE);
    
    // Use the same logic as server.js
    const isDevelopment = (process.env.NODE_ENV || '').toLowerCase() === 'development';
    let DB = process.env.LOCAL_DATABASE && isDevelopment ? process.env.LOCAL_DATABASE : process.env.DATABASE;
    
    console.log('Selected DB:', DB);
    
    // If the DATABASE string contains the <PASSWORD> placeholder and we have a password, replace it; otherwise use as-is
    if (DB && DB.includes('<PASSWORD>') && process.env.DATABASE_PASSWORD) {
      DB = DB.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
    }
    
    console.log('Final DB string:', DB);
    
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connection successful!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Insert categories with proper parent relationships
const insertCategories = async () => {
  try {
    console.log('Inserting categories...');
    
    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');
    
    // Insert main categories first
    const mainCategories = dummyCategories.filter(cat => cat.level === 0);
    const insertedMainCategories = await Category.insertMany(mainCategories);
    console.log(`Inserted ${insertedMainCategories.length} main categories`);
    
    // Create a map for quick lookup
    const categoryMap = {};
    insertedMainCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });
    
    // Insert subcategories with proper parent references
    const subcategories = dummyCategories.filter(cat => cat.level === 1);
    
    for (const subcat of subcategories) {
      let parentId = null;
      
      // Determine parent based on gender and category type
      if (subcat.gender === 'men') {
        parentId = categoryMap["Men's Shoes"];
      } else if (subcat.gender === 'women') {
        parentId = categoryMap["Women's Shoes"];
      } else if (subcat.gender === 'kids') {
        parentId = categoryMap["Kids' Shoes"];
      } else if (subcat.gender === 'unisex') {
        parentId = categoryMap["Hac Foods"];
      }
      
      if (parentId) {
        subcat.parent = parentId;
        await Category.create(subcat);
        console.log(`Inserted subcategory: ${subcat.name}`);
      }
    }
    
    console.log('All categories inserted successfully!');
    return categoryMap;
    
  } catch (error) {
    console.error('Error inserting categories:', error);
    throw error;
  }
};

// Insert products with proper category references
const insertProducts = async (categoryMap) => {
  try {
    console.log('Inserting products...');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Update product data with local image paths and category references
    const productsToInsert = dummyProducts.map(product => {
      const updatedProduct = { ...product };
      
      // Set category based on product type
      if (product.gender === 'men') {
        if (product.style === 'sneakers') {
          updatedProduct.category = categoryMap["Men's Shoes"];
        } else if (product.style === 'loafers') {
          updatedProduct.category = categoryMap["Men's Shoes"];
        } else if (product.style === 'boots') {
          updatedProduct.category = categoryMap["Men's Shoes"];
        }
      } else if (product.gender === 'women') {
        if (product.style === 'heels') {
          updatedProduct.category = categoryMap["Women's Shoes"];
        } else if (product.style === 'flats') {
          updatedProduct.category = categoryMap["Women's Shoes"];
        } else if (product.style === 'sandals') {
          updatedProduct.category = categoryMap["Women's Shoes"];
        } else if (product.style === 'boots') {
          updatedProduct.category = categoryMap["Women's Shoes"];
        } else if (product.style === 'pumps') {
          updatedProduct.category = categoryMap["Women's Shoes"];
        } else if (product.style === 'sneakers') {
          updatedProduct.category = categoryMap["Women's Shoes"];
        }
      } else if (product.title.includes("Kids'") || product.title.includes("kids")) {
        updatedProduct.category = categoryMap["Kids' Shoes"];
      } else if (product.gender === 'unisex') {
        updatedProduct.category = categoryMap["Hac Foods"];
      }
      
      // Update image URLs to local paths
      const imageMapping = {
        'Urban Drift Sneaker': '/uploads/products/urban-drift-sneaker.jpg',
        'Classic Leather Loafers': '/uploads/products/classic-leather-loafers.jpg',
        'Elegant Stiletto Heels': '/uploads/products/elegant-stiletto-heels.jpg',
        'Comfortable Ballet Flats': '/uploads/products/comfortable-ballet-flats.jpg',
        'Rugged Hiking Boots': '/uploads/products/rugged-hiking-boots.jpg',
        'Summer Beach Sandals': '/uploads/products/summer-beach-sandals.jpg',
        'Kids\' School Sneakers': '/uploads/products/kids-school-sneakers.jpg',
        'Premium Desi Ghee': '/uploads/products/premium-desi-ghee.jpg',
        'Organic Honey': '/uploads/products/organic-honey.jpg',
        'Classic Oxford Shoes': '/uploads/products/classic-oxford-shoes.jpg',
        'Sport Running Shoes': '/uploads/products/sport-running-shoes.jpg',
        'Ankle Boots': '/uploads/products/ankle-boots.jpg',
        'Pump Heels': '/uploads/products/pump-heels.jpg',
        'Kids\' Sports Shoes': '/uploads/products/kids-sports-shoes.jpg',
        'Fresh Milk': '/uploads/products/fresh-milk.jpg',
        'Cottage Cheese': '/uploads/products/cottage-cheese.jpg',
        'Leather Dress Shoes': '/uploads/products/leather-dress-shoes.jpg',
        'Canvas Sneakers': '/uploads/products/canvas-sneakers.jpg'
      };
      
      const localImagePath = imageMapping[product.title];
      if (localImagePath) {
        // Update main images
        updatedProduct.mainImages = updatedProduct.mainImages.map(img => ({
          ...img,
          url: localImagePath
        }));
        
        // Update variant images
        updatedProduct.variants = updatedProduct.variants.map(variant => ({
          ...variant,
          images: variant.images.map(img => ({
            ...img,
            url: localImagePath
          }))
        }));
      }
      
      return updatedProduct;
    });
    
    // Insert products
    const insertedProducts = await Product.insertMany(productsToInsert);
    console.log(`Inserted ${insertedProducts.length} products successfully!`);
    
    return insertedProducts;
    
  } catch (error) {
    console.error('Error inserting products:', error);
    throw error;
  }
};

// Update category product counts
const updateCategoryCounts = async () => {
  try {
    console.log('Updating category product counts...');
    
    const categories = await Category.find({});
    
    for (const category of categories) {
      const productCount = await Product.countDocuments({ category: category._id });
      await Category.findByIdAndUpdate(category._id, { productCount });
      console.log(`Updated ${category.name}: ${productCount} products`);
    }
    
    console.log('Category product counts updated successfully!');
    
  } catch (error) {
    console.error('Error updating category counts:', error);
    throw error;
  }
};

// Main function to insert all dummy data
const insertAllDummyData = async () => {
  try {
    await connectDB();
    
    console.log('Starting dummy data insertion...');
    
    // Insert categories and get category map
    const categoryMap = await insertCategories();
    
    // Insert products
    await insertProducts(categoryMap);
    
    // Update category counts
    await updateCategoryCounts();
    
    console.log('All dummy data inserted successfully!');
    console.log('Summary:');
    console.log('- Categories: 15');
    console.log('- Products: 20');
    console.log('- Images: Downloaded to local folders');
    
  } catch (error) {
    console.error('Error inserting dummy data:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

// Run the insertion if this file is executed directly
if (require.main === module) {
  insertAllDummyData();
}

module.exports = { insertAllDummyData };
