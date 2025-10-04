const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const createDirectories = () => {
  const dirs = [
    'public/uploads/products',
    'public/uploads/categories'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Download image from URL
const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filename);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Downloaded: ${filename}`);
          resolve(filename);
        });
        
        fileStream.on('error', (err) => {
          fs.unlink(filename, () => {}); // Delete the file on error
          reject(err);
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
};

// Download all images from dummy data
const downloadAllImages = async () => {
  try {
    createDirectories();
    
    // Import dummy data
    const dummyCategories = require('../data/dummyCategories');
    const dummyProducts = require('../data/dummyProducts');
    
    console.log('Starting image downloads...');
    
    // Download category images (placeholder images)
    const categoryImages = [
      {
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
        filename: 'public/uploads/categories/mens-shoes.jpg'
      },
      {
        url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop',
        filename: 'public/uploads/categories/womens-shoes.jpg'
      },
      {
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
        filename: 'public/uploads/categories/kids-shoes.jpg'
      },
      {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop',
        filename: 'public/uploads/categories/hac-foods.jpg'
      }
    ];
    
    // Download product images
    const productImages = [
      // Men's Sneakers
      {
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
        filename: 'public/uploads/products/urban-drift-sneaker.jpg'
      },
      // Men's Loafers
      {
        url: 'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=500&h=500&fit=crop',
        filename: 'public/uploads/products/classic-leather-loafers.jpg'
      },
      // Women's Heels
      {
        url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop',
        filename: 'public/uploads/products/elegant-stiletto-heels.jpg'
      },
      // Women's Flats
      {
        url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop',
        filename: 'public/uploads/products/comfortable-ballet-flats.jpg'
      },
      // Men's Boots
      {
        url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=500&fit=crop',
        filename: 'public/uploads/products/rugged-hiking-boots.jpg'
      },
      // Women's Sandals
      {
        url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop',
        filename: 'public/uploads/products/summer-beach-sandals.jpg'
      },
      // Kids' Shoes
      {
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
        filename: 'public/uploads/products/kids-school-sneakers.jpg'
      },
      // Hac Foods - Ghee
      {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop',
        filename: 'public/uploads/products/premium-desi-ghee.jpg'
      },
      // Hac Foods - Honey
      {
        url: 'https://images.unsplash.com/photo-1558642084-fd07fae5282e?w=500&h=500&fit=crop',
        filename: 'public/uploads/products/organic-honey.jpg'
      },
      // Additional products
      {
        url: 'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=500&h=500&fit=crop',
        filename: 'public/uploads/products/classic-oxford-shoes.jpg'
      },
      {
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
        filename: 'public/uploads/products/sport-running-shoes.jpg'
      },
      {
        url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop',
        filename: 'public/uploads/products/ankle-boots.jpg'
      },
      {
        url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop',
        filename: 'public/uploads/products/pump-heels.jpg'
      },
      {
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
        filename: 'public/uploads/products/kids-sports-shoes.jpg'
      },
      {
        url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&h=500&fit=crop',
        filename: 'public/uploads/products/fresh-milk.jpg'
      },
      {
        url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&h=500&fit=crop',
        filename: 'public/uploads/products/cottage-cheese.jpg'
      },
      {
        url: 'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=500&h=500&fit=crop',
        filename: 'public/uploads/products/leather-dress-shoes.jpg'
      },
      {
        url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop',
        filename: 'public/uploads/products/canvas-sneakers.jpg'
      }
    ];
    
    // Download category images
    console.log('Downloading category images...');
    for (const image of categoryImages) {
      try {
        await downloadImage(image.url, image.filename);
      } catch (error) {
        console.error(`Failed to download category image: ${error.message}`);
      }
    }
    
    // Download product images
    console.log('Downloading product images...');
    for (const image of productImages) {
      try {
        await downloadImage(image.url, image.filename);
      } catch (error) {
        console.error(`Failed to download product image: ${error.message}`);
      }
    }
    
    console.log('All images downloaded successfully!');
    
  } catch (error) {
    console.error('Error downloading images:', error);
  }
};

// Run the download function
if (require.main === module) {
  downloadAllImages();
}

module.exports = { downloadAllImages };
