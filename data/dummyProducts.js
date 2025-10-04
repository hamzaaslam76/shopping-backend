const mongoose = require('mongoose');

// Product data based on our productModel.js schema - Only footwear products
const dummyProducts = [
  // Men's Sneakers
  {
    title: "Urban Drift Sneaker",
    description: "Modern athletic sneaker with superior comfort and style. Perfect for daily wear and light sports activities.",
    shortDescription: "Comfortable athletic sneaker for daily wear",
    price: 5499,
    oldPrice: 6999,
    currency: "PKR",
    gender: "men",
    brand: "Urban",
    material: "synthetic",
    style: "sneakers",
    heelHeight: "flat",
    occasion: ["casual", "sports"],
    variants: [
      {
        size: "40",
        color: "Black",
        colorCode: "#000000",
        stock: 25,
        sku: "URB-DRIFT-40-BLK",
        images: [
          {
            url: "/uploads/products/urban-drift-sneaker.jpg",
            alt: "Urban Drift Sneaker Black",
            isPrimary: true
          }
        ]
      },
      {
        size: "42",
        color: "White",
        colorCode: "#FFFFFF",
        stock: 30,
        sku: "URB-DRIFT-42-WHT",
        images: [
          {
            url: "/uploads/products/urban-drift-sneaker.jpg",
            alt: "Urban Drift Sneaker White",
            isPrimary: true
          }
        ]
      }
    ],
    availableSizes: ["40", "42"],
    availableColors: [
      { name: "Black", code: "#000000" },
      { name: "White", code: "#FFFFFF" }
    ],
    mainImages: [
      {
        url: "/uploads/products/urban-drift-sneaker.jpg",
        alt: "Urban Drift Sneaker",
        isPrimary: true
      }
    ],
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    metaTitle: "Urban Drift Sneaker - Men's Athletic Footwear",
    metaDescription: "Comfortable and stylish urban drift sneaker for men",
    tags: ["comfortable", "stylish", "athletic"],
    averageRating: 4.5,
    ratingsQuantity: 120,
    totalSold: 45,
    viewCount: 320,
    discountPercentage: 21,
    careInstructions: ["Clean with damp cloth", "Air dry"],
    weight: 350,
    dimensions: { length: 30, width: 12, height: 10 }
  },

  {
    title: "Classic Leather Loafers",
    description: "Premium leather loafers crafted for comfort and elegance. Perfect for business and formal occasions.",
    shortDescription: "Premium leather loafers for formal wear",
    price: 8999,
    oldPrice: 11999,
    currency: "PKR",
    gender: "men",
    brand: "Classic",
    material: "leather",
    style: "loafers",
    heelHeight: "flat",
    occasion: ["formal", "office"],
    variants: [
      {
        size: "41",
        color: "Brown",
        colorCode: "#8B4513",
        stock: 15,
        sku: "CLS-LOAF-41-BRN",
        images: [
          {
            url: "/uploads/products/classic-leather-loafers.jpg",
            alt: "Classic Leather Loafers Brown",
            isPrimary: true
          }
        ]
      }
    ],
    availableSizes: ["41"],
    availableColors: [
      { name: "Brown", code: "#8B4513" }
    ],
    mainImages: [
      {
        url: "/uploads/products/classic-leather-loafers.jpg",
        alt: "Classic Leather Loafers",
        isPrimary: true
      }
    ],
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    metaTitle: "Classic Leather Loafers - Men's Formal Footwear",
    metaDescription: "Premium leather loafers for business and formal occasions",
    tags: ["premium", "leather", "formal"],
    averageRating: 4.8,
    ratingsQuantity: 85,
    totalSold: 32,
    viewCount: 180,
    discountPercentage: 25,
    careInstructions: ["Polish regularly", "Store in dry place"],
    weight: 400,
    dimensions: { length: 32, width: 13, height: 8 }
  },

  // Women's Heels
  {
    title: "Elegant Stiletto Heels",
    description: "Sophisticated stiletto heels designed for elegance and style. Perfect for parties and formal events.",
    shortDescription: "Elegant stiletto heels for special occasions",
    price: 12999,
    oldPrice: 15999,
    currency: "PKR",
    gender: "women",
    brand: "Elegance",
    material: "synthetic",
    style: "heels",
    heelHeight: "high (3-4 inches)",
    occasion: ["party", "formal", "wedding"],
    variants: [
      {
        size: "38",
        color: "Red",
        colorCode: "#FF0000",
        stock: 20,
        sku: "ELG-STIL-38-RED",
        images: [
          {
            url: "/uploads/products/elegant-stiletto-heels.jpg",
            alt: "Elegant Stiletto Heels Red",
            isPrimary: true
          }
        ]
      },
      {
        size: "40",
        color: "Black",
        colorCode: "#000000",
        stock: 25,
        sku: "ELG-STIL-40-BLK",
        images: [
          {
            url: "/uploads/products/elegant-stiletto-heels.jpg",
            alt: "Elegant Stiletto Heels Black",
            isPrimary: true
          }
        ]
      }
    ],
    availableSizes: ["38", "40"],
    availableColors: [
      { name: "Red", code: "#FF0000" },
      { name: "Black", code: "#000000" }
    ],
    mainImages: [
      {
        url: "/uploads/products/elegant-stiletto-heels.jpg",
        alt: "Elegant Stiletto Heels",
        isPrimary: true
      }
    ],
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    metaTitle: "Elegant Stiletto Heels - Women's Party Footwear",
    metaDescription: "Sophisticated stiletto heels for parties and formal events",
    tags: ["elegant", "party", "formal"],
    averageRating: 4.6,
    ratingsQuantity: 95,
    totalSold: 28,
    viewCount: 250,
    discountPercentage: 19,
    careInstructions: ["Handle with care", "Store in shoe box"],
    weight: 300,
    dimensions: { length: 28, width: 8, height: 12 }
  },

  {
    title: "Comfortable Ballet Flats",
    description: "Soft and comfortable ballet flats perfect for everyday wear. Stylish yet practical for long hours.",
    shortDescription: "Comfortable ballet flats for daily wear",
    price: 3999,
    oldPrice: 4999,
    currency: "PKR",
    gender: "women",
    brand: "Comfort",
    material: "canvas",
    style: "flats",
    heelHeight: "flat",
    occasion: ["casual", "office"],
    variants: [
      {
        size: "39",
        color: "Navy",
        colorCode: "#000080",
        stock: 35,
        sku: "COM-BALL-39-NAV",
        images: [
          {
            url: "/uploads/products/comfortable-ballet-flats.jpg",
            alt: "Comfortable Ballet Flats Navy",
            isPrimary: true
          }
        ]
      }
    ],
    availableSizes: ["39"],
    availableColors: [
      { name: "Navy", code: "#000080" }
    ],
    mainImages: [
      {
        url: "/uploads/products/comfortable-ballet-flats.jpg",
        alt: "Comfortable Ballet Flats",
        isPrimary: true
      }
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    metaTitle: "Comfortable Ballet Flats - Women's Casual Footwear",
    metaDescription: "Soft and comfortable ballet flats for everyday wear",
    tags: ["comfortable", "casual", "practical"],
    averageRating: 4.3,
    ratingsQuantity: 75,
    totalSold: 42,
    viewCount: 150,
    discountPercentage: 20,
    careInstructions: ["Machine washable", "Air dry"],
    weight: 200,
    dimensions: { length: 26, width: 10, height: 5 }
  },

  // Men's Boots
  {
    title: "Rugged Hiking Boots",
    description: "Durable hiking boots designed for outdoor adventures. Waterproof and comfortable for long treks.",
    shortDescription: "Durable hiking boots for outdoor adventures",
    price: 11999,
    oldPrice: 14999,
    currency: "PKR",
    gender: "men",
    brand: "Rugged",
    material: "leather",
    style: "boots",
    heelHeight: "low (1-2 inches)",
    occasion: ["outdoor", "sports"],
    variants: [
      {
        size: "43",
        color: "Brown",
        colorCode: "#8B4513",
        stock: 18,
        sku: "RUG-HIK-43-BRN",
        images: [
          {
            url: "/uploads/products/rugged-hiking-boots.jpg",
            alt: "Rugged Hiking Boots Brown",
            isPrimary: true
          }
        ]
      }
    ],
    availableSizes: ["43"],
    availableColors: [
      { name: "Brown", code: "#8B4513" }
    ],
    mainImages: [
      {
        url: "/uploads/products/rugged-hiking-boots.jpg",
        alt: "Rugged Hiking Boots",
        isPrimary: true
      }
    ],
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    metaTitle: "Rugged Hiking Boots - Men's Outdoor Footwear",
    metaDescription: "Durable and waterproof hiking boots for outdoor adventures",
    tags: ["durable", "waterproof", "outdoor"],
    averageRating: 4.7,
    ratingsQuantity: 65,
    totalSold: 22,
    viewCount: 140,
    discountPercentage: 20,
    careInstructions: ["Clean with brush", "Apply leather conditioner"],
    weight: 800,
    dimensions: { length: 35, width: 15, height: 15 }
  },

  // Women's Sandals
  {
    title: "Summer Beach Sandals",
    description: "Lightweight and comfortable beach sandals perfect for summer vacations and casual outings.",
    shortDescription: "Lightweight beach sandals for summer",
    price: 2999,
    oldPrice: 3999,
    currency: "PKR",
    gender: "women",
    brand: "Summer",
    material: "rubber",
    style: "sandals",
    heelHeight: "flat",
    occasion: ["casual", "outdoor"],
    variants: [
      {
        size: "37",
        color: "Blue",
        colorCode: "#0000FF",
        stock: 40,
        sku: "SUM-BEACH-37-BLU",
        images: [
          {
            url: "/uploads/products/summer-beach-sandals.jpg",
            alt: "Summer Beach Sandals Blue",
            isPrimary: true
          }
        ]
      }
    ],
    availableSizes: ["37"],
    availableColors: [
      { name: "Blue", code: "#0000FF" }
    ],
    mainImages: [
      {
        url: "/uploads/products/summer-beach-sandals.jpg",
        alt: "Summer Beach Sandals",
        isPrimary: true
      }
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    metaTitle: "Summer Beach Sandals - Women's Casual Footwear",
    metaDescription: "Lightweight and comfortable beach sandals for summer",
    tags: ["lightweight", "summer", "beach"],
    averageRating: 4.2,
    ratingsQuantity: 55,
    totalSold: 38,
    viewCount: 120,
    discountPercentage: 25,
    careInstructions: ["Rinse with water", "Air dry"],
    weight: 150,
    dimensions: { length: 24, width: 9, height: 3 }
  },

  // Kids' Shoes (using unisex gender)
  {
    title: "Kids' School Sneakers",
    description: "Comfortable and durable school sneakers designed for active children. Easy to clean and maintain.",
    shortDescription: "Comfortable school sneakers for kids",
    price: 2499,
    oldPrice: 2999,
    currency: "PKR",
    gender: "unisex",
    brand: "School",
    material: "synthetic",
    style: "sneakers",
    heelHeight: "flat",
    occasion: ["casual", "sports"],
    variants: [
      {
        size: "35",
        color: "White",
        colorCode: "#FFFFFF",
        stock: 50,
        sku: "SCH-KIDS-35-WHT",
        images: [
          {
            url: "/uploads/products/kids-school-sneakers.jpg",
            alt: "Kids School Sneakers White",
            isPrimary: true
          }
        ]
      }
    ],
    availableSizes: ["35"],
    availableColors: [
      { name: "White", code: "#FFFFFF" }
    ],
    mainImages: [
      {
        url: "/uploads/products/kids-school-sneakers.jpg",
        alt: "Kids School Sneakers",
        isPrimary: true
      }
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    metaTitle: "Kids' School Sneakers - Children's Footwear",
    metaDescription: "Comfortable and durable school sneakers for active children",
    tags: ["comfortable", "durable", "kids"],
    averageRating: 4.4,
    ratingsQuantity: 40,
    totalSold: 35,
    viewCount: 80,
    discountPercentage: 17,
    careInstructions: ["Machine washable", "Air dry"],
    weight: 200,
    dimensions: { length: 22, width: 8, height: 6 }
  },

  // Additional Men's Products
  {
    title: "Classic Oxford Shoes",
    description: "Traditional oxford shoes crafted with premium leather. Perfect for formal occasions and business meetings.",
    shortDescription: "Traditional oxford shoes for formal wear",
    price: 10999,
    oldPrice: 13999,
    currency: "PKR",
    gender: "men",
    brand: "Classic",
    material: "leather",
    style: "loafers",
    heelHeight: "flat",
    occasion: ["formal", "office"],
    variants: [
      {
        size: "42",
        color: "Black",
        colorCode: "#000000",
        stock: 12,
        sku: "CLS-OXF-42-BLK",
        images: [
          {
            url: "/uploads/products/classic-oxford-shoes.jpg",
            alt: "Classic Oxford Shoes Black",
            isPrimary: true
          }
        ]
      }
    ],
    availableSizes: ["42"],
    availableColors: [
      { name: "Black", code: "#000000" }
    ],
    mainImages: [
      {
        url: "/uploads/products/classic-oxford-shoes.jpg",
        alt: "Classic Oxford Shoes",
        isPrimary: true
      }
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    metaTitle: "Classic Oxford Shoes - Men's Formal Footwear",
    metaDescription: "Traditional oxford shoes crafted with premium leather",
    tags: ["traditional", "premium", "formal"],
    averageRating: 4.6,
    ratingsQuantity: 70,
    totalSold: 25,
    viewCount: 160,
    discountPercentage: 21,
    careInstructions: ["Polish regularly", "Store in shoe trees"],
    weight: 450,
    dimensions: { length: 33, width: 14, height: 9 }
  },

  {
    title: "Sport Running Shoes",
    description: "High-performance running shoes with advanced cushioning technology. Perfect for athletes and fitness enthusiasts.",
    shortDescription: "High-performance running shoes for athletes",
    price: 7999,
    oldPrice: 9999,
    currency: "PKR",
    gender: "men",
    brand: "Sport",
    material: "synthetic",
    style: "sneakers",
    heelHeight: "flat",
    occasion: ["sports", "casual"],
    variants: [
      {
        size: "41",
        color: "Blue",
        colorCode: "#0000FF",
        stock: 30,
        sku: "SPT-RUN-41-BLU",
        images: [
          {
            url: "/uploads/products/sport-running-shoes.jpg",
            alt: "Sport Running Shoes Blue",
            isPrimary: true
          }
        ]
      }
    ],
    availableSizes: ["41"],
    availableColors: [
      { name: "Blue", code: "#0000FF" }
    ],
    mainImages: [
      {
        url: "/uploads/products/sport-running-shoes.jpg",
        alt: "Sport Running Shoes",
        isPrimary: true
      }
    ],
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    metaTitle: "Sport Running Shoes - Men's Athletic Footwear",
    metaDescription: "High-performance running shoes with advanced cushioning",
    tags: ["performance", "cushioning", "athletic"],
    averageRating: 4.7,
    ratingsQuantity: 90,
    totalSold: 40,
    viewCount: 200,
    discountPercentage: 20,
    careInstructions: ["Clean with damp cloth", "Air dry"],
    weight: 320,
    dimensions: { length: 31, width: 13, height: 11 }
  },

  // Additional Women's Products
  {
    title: "Ankle Boots",
    description: "Stylish ankle boots perfect for autumn and winter. Comfortable heel height and trendy design.",
    shortDescription: "Stylish ankle boots for autumn and winter",
    price: 6999,
    oldPrice: 8999,
    currency: "PKR",
    gender: "women",
    brand: "Style",
    material: "synthetic",
    style: "boots",
    heelHeight: "medium (2-3 inches)",
    occasion: ["casual", "office"],
    variants: [
      {
        size: "39",
        color: "Brown",
        colorCode: "#8B4513",
        stock: 22,
        sku: "STY-ANK-39-BRN",
        images: [
          {
            url: "/uploads/products/ankle-boots.jpg",
            alt: "Ankle Boots Brown",
            isPrimary: true
          }
        ]
      }
    ],
    availableSizes: ["39"],
    availableColors: [
      { name: "Brown", code: "#8B4513" }
    ],
    mainImages: [
      {
        url: "/uploads/products/ankle-boots.jpg",
        alt: "Ankle Boots",
        isPrimary: true
      }
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    metaTitle: "Ankle Boots - Women's Fashion Footwear",
    metaDescription: "Stylish ankle boots perfect for autumn and winter",
    tags: ["stylish", "trendy", "comfortable"],
    averageRating: 4.5,
    ratingsQuantity: 60,
    totalSold: 28,
    viewCount: 130,
    discountPercentage: 22,
    careInstructions: ["Clean with brush", "Store in dry place"],
    weight: 380,
    dimensions: { length: 29, width: 11, height: 12 }
  },

  {
    title: "Pump Heels",
    description: "Classic pump heels with pointed toe design. Perfect for professional settings and evening events.",
    shortDescription: "Classic pump heels for professional wear",
    price: 8999,
    oldPrice: 11999,
    currency: "PKR",
    gender: "women",
    brand: "Classic",
    material: "synthetic",
    style: "pumps",
    heelHeight: "medium (2-3 inches)",
    occasion: ["office", "formal"],
    variants: [
      {
        size: "38",
        color: "Black",
        colorCode: "#000000",
        stock: 18,
        sku: "CLS-PUMP-38-BLK",
        images: [
          {
            url: "/uploads/products/pump-heels.jpg",
            alt: "Pump Heels Black",
            isPrimary: true
          }
        ]
      }
    ],
    availableSizes: ["38"],
    availableColors: [
      { name: "Black", code: "#000000" }
    ],
    mainImages: [
      {
        url: "/uploads/products/pump-heels.jpg",
        alt: "Pump Heels",
        isPrimary: true
      }
    ],
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    metaTitle: "Pump Heels - Women's Professional Footwear",
    metaDescription: "Classic pump heels with pointed toe design",
    tags: ["classic", "professional", "elegant"],
    averageRating: 4.4,
    ratingsQuantity: 50,
    totalSold: 20,
    viewCount: 110,
    discountPercentage: 25,
    careInstructions: ["Handle with care", "Store in shoe box"],
    weight: 280,
    dimensions: { length: 27, width: 9, height: 10 }
  },

  // More Kids' Products
  {
    title: "Kids' Sports Shoes",
    description: "Comfortable sports shoes designed for active children. Durable construction and easy maintenance.",
    shortDescription: "Comfortable sports shoes for active kids",
    price: 3499,
    oldPrice: 4499,
    currency: "PKR",
    gender: "unisex",
    brand: "Kids",
    material: "synthetic",
    style: "sneakers",
    heelHeight: "flat",
    occasion: ["sports", "casual"],
    variants: [
      {
        size: "36",
        color: "Red",
        colorCode: "#FF0000",
        stock: 45,
        sku: "KID-SPT-36-RED",
        images: [
          {
            url: "/uploads/products/kids-sports-shoes.jpg",
            alt: "Kids Sports Shoes Red",
            isPrimary: true
          }
        ]
      }
    ],
    availableSizes: ["36"],
    availableColors: [
      { name: "Red", code: "#FF0000" }
    ],
    mainImages: [
      {
        url: "/uploads/products/kids-sports-shoes.jpg",
        alt: "Kids Sports Shoes",
        isPrimary: true
      }
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    metaTitle: "Kids' Sports Shoes - Children's Athletic Footwear",
    metaDescription: "Comfortable sports shoes designed for active children",
    tags: ["comfortable", "durable", "active"],
    averageRating: 4.3,
    ratingsQuantity: 35,
    totalSold: 30,
    viewCount: 70,
    discountPercentage: 22,
    careInstructions: ["Machine washable", "Air dry"],
    weight: 180,
    dimensions: { length: 23, width: 9, height: 7 }
  },

  // Additional Men's Formal
  {
    title: "Leather Dress Shoes",
    description: "Premium leather dress shoes with classic design. Perfect for formal occasions and business attire.",
    shortDescription: "Premium leather dress shoes for formal occasions",
    price: 12999,
    oldPrice: 15999,
    currency: "PKR",
    gender: "men",
    brand: "Premium",
    material: "leather",
    style: "loafers",
    heelHeight: "flat",
    occasion: ["formal", "wedding"],
    variants: [
      {
        size: "43",
        color: "Black",
        colorCode: "#000000",
        stock: 8,
        sku: "PRM-DRESS-43-BLK",
        images: [
          {
            url: "/uploads/products/leather-dress-shoes.jpg",
            alt: "Leather Dress Shoes Black",
            isPrimary: true
          }
        ]
      }
    ],
    availableSizes: ["43"],
    availableColors: [
      { name: "Black", code: "#000000" }
    ],
    mainImages: [
      {
        url: "/uploads/products/leather-dress-shoes.jpg",
        alt: "Leather Dress Shoes",
        isPrimary: true
      }
    ],
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    metaTitle: "Leather Dress Shoes - Men's Premium Formal Footwear",
    metaDescription: "Premium leather dress shoes with classic design",
    tags: ["premium", "classic", "formal"],
    averageRating: 4.8,
    ratingsQuantity: 45,
    totalSold: 15,
    viewCount: 90,
    discountPercentage: 19,
    careInstructions: ["Polish regularly", "Store in shoe trees"],
    weight: 500,
    dimensions: { length: 34, width: 15, height: 10 }
  },

  // Additional Women's Casual
  {
    title: "Canvas Sneakers",
    description: "Comfortable canvas sneakers perfect for casual outings and everyday wear. Lightweight and breathable.",
    shortDescription: "Comfortable canvas sneakers for casual wear",
    price: 4999,
    oldPrice: 6499,
    currency: "PKR",
    gender: "women",
    brand: "Canvas",
    material: "canvas",
    style: "sneakers",
    heelHeight: "flat",
    occasion: ["casual", "sports"],
    variants: [
      {
        size: "40",
        color: "Pink",
        colorCode: "#FFC0CB",
        stock: 35,
        sku: "CAN-SNK-40-PNK",
        images: [
          {
            url: "/uploads/products/canvas-sneakers.jpg",
            alt: "Canvas Sneakers Pink",
            isPrimary: true
          }
        ]
      }
    ],
    availableSizes: ["40"],
    availableColors: [
      { name: "Pink", code: "#FFC0CB" }
    ],
    mainImages: [
      {
        url: "/uploads/products/canvas-sneakers.jpg",
        alt: "Canvas Sneakers",
        isPrimary: true
      }
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    metaTitle: "Canvas Sneakers - Women's Casual Footwear",
    metaDescription: "Comfortable canvas sneakers perfect for casual outings",
    tags: ["comfortable", "lightweight", "breathable"],
    averageRating: 4.3,
    ratingsQuantity: 65,
    totalSold: 45,
    viewCount: 140,
    discountPercentage: 23,
    careInstructions: ["Machine washable", "Air dry"],
    weight: 250,
    dimensions: { length: 28, width: 11, height: 8 }
  }
];

module.exports = dummyProducts;