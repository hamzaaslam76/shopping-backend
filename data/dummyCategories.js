const mongoose = require('mongoose');

// Category data based on our categoryModel.js schema
const dummyCategories = [
  // Main Categories
  {
    name: "Men's Shoes",
    description: "Complete collection of men's footwear including sneakers, formal shoes, boots, and casual wear",
    gender: "men",
    level: 0,
    parent: null,
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    metaTitle: "Men's Shoes Collection - Premium Footwear",
    metaDescription: "Discover our premium collection of men's shoes including sneakers, boots, formal shoes and casual wear",
    productCount: 0
  },
  {
    name: "Women's Shoes",
    description: "Elegant and stylish women's footwear collection featuring heels, flats, boots, and sneakers",
    gender: "women",
    level: 0,
    parent: null,
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
    metaTitle: "Women's Shoes Collection - Fashion Footwear",
    metaDescription: "Explore our fashionable women's shoes collection with heels, flats, boots, and sneakers",
    productCount: 0
  },
  {
    name: "Kids' Shoes",
    description: "Comfortable and durable footwear for children of all ages",
    gender: "kids",
    level: 0,
    parent: null,
    isActive: true,
    isFeatured: false,
    sortOrder: 3,
    metaTitle: "Kids' Shoes - Comfortable Children's Footwear",
    metaDescription: "Quality kids' shoes designed for comfort and durability",
    productCount: 0
  },
  {
    name: "Hac Foods",
    description: "Premium food products including dairy items, honey, and organic products",
    gender: "unisex",
    level: 0,
    parent: null,
    isActive: true,
    isFeatured: true,
    sortOrder: 4,
    metaTitle: "Hac Foods - Premium Food Products",
    metaDescription: "Discover our premium food collection including dairy products, honey, and organic items",
    productCount: 0
  },

  // Men's Subcategories
  {
    name: "Men's Sneakers",
    description: "Comfortable and stylish sneakers for men",
    gender: "men",
    level: 1,
    parent: null, // Will be set to Men's Shoes ID
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    metaTitle: "Men's Sneakers - Athletic Footwear",
    metaDescription: "Premium men's sneakers for sports and casual wear",
    productCount: 0
  },
  {
    name: "Men's Formal Shoes",
    description: "Professional and elegant formal shoes for men",
    gender: "men",
    level: 1,
    parent: null, // Will be set to Men's Shoes ID
    isActive: true,
    isFeatured: false,
    sortOrder: 2,
    metaTitle: "Men's Formal Shoes - Business Attire",
    metaDescription: "Professional formal shoes for business and formal occasions",
    productCount: 0
  },
  {
    name: "Men's Boots",
    description: "Durable and stylish boots for men",
    gender: "men",
    level: 1,
    parent: null, // Will be set to Men's Shoes ID
    isActive: true,
    isFeatured: false,
    sortOrder: 3,
    metaTitle: "Men's Boots - Rugged Footwear",
    metaDescription: "Durable boots for outdoor activities and casual wear",
    productCount: 0
  },
  {
    name: "Men's Loafers",
    description: "Comfortable slip-on loafers for men",
    gender: "men",
    level: 1,
    parent: null, // Will be set to Men's Shoes ID
    isActive: true,
    isFeatured: false,
    sortOrder: 4,
    metaTitle: "Men's Loafers - Casual Slip-ons",
    metaDescription: "Comfortable loafers perfect for casual and semi-formal occasions",
    productCount: 0
  },

  // Women's Subcategories
  {
    name: "Women's Heels",
    description: "Elegant high heels for women",
    gender: "women",
    level: 1,
    parent: null, // Will be set to Women's Shoes ID
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    metaTitle: "Women's Heels - Elegant Footwear",
    metaDescription: "Stylish high heels for formal and party occasions",
    productCount: 0
  },
  {
    name: "Women's Flats",
    description: "Comfortable flat shoes for women",
    gender: "women",
    level: 1,
    parent: null, // Will be set to Women's Shoes ID
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
    metaTitle: "Women's Flats - Comfortable Footwear",
    metaDescription: "Comfortable flat shoes for everyday wear",
    productCount: 0
  },
  {
    name: "Women's Sandals",
    description: "Stylish sandals for women",
    gender: "women",
    level: 1,
    parent: null, // Will be set to Women's Shoes ID
    isActive: true,
    isFeatured: false,
    sortOrder: 3,
    metaTitle: "Women's Sandals - Summer Footwear",
    metaDescription: "Comfortable sandals perfect for summer and casual wear",
    productCount: 0
  },
  {
    name: "Women's Boots",
    description: "Fashionable boots for women",
    gender: "women",
    level: 1,
    parent: null, // Will be set to Women's Shoes ID
    isActive: true,
    isFeatured: false,
    sortOrder: 4,
    metaTitle: "Women's Boots - Fashion Footwear",
    metaDescription: "Stylish boots for winter and fashion-forward looks",
    productCount: 0
  },

  // Kids' Subcategories
  {
    name: "Kids' School Shoes",
    description: "Comfortable shoes for school-going children",
    gender: "kids",
    level: 1,
    parent: null, // Will be set to Kids' Shoes ID
    isActive: true,
    isFeatured: false,
    sortOrder: 1,
    metaTitle: "Kids' School Shoes - Educational Footwear",
    metaDescription: "Comfortable and durable shoes for school activities",
    productCount: 0
  },
  {
    name: "Kids' Sports Shoes",
    description: "Athletic shoes for active children",
    gender: "kids",
    level: 1,
    parent: null, // Will be set to Kids' Shoes ID
    isActive: true,
    isFeatured: false,
    sortOrder: 2,
    metaTitle: "Kids' Sports Shoes - Athletic Footwear",
    metaDescription: "Comfortable sports shoes for active children",
    productCount: 0
  },

  // Hac Foods Subcategories
  {
    name: "Dairy Products",
    description: "Fresh dairy products including milk, cheese, and yogurt",
    gender: "unisex",
    level: 1,
    parent: null, // Will be set to Hac Foods ID
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    metaTitle: "Dairy Products - Fresh Milk & Cheese",
    metaDescription: "Premium dairy products including fresh milk, cheese, and yogurt",
    productCount: 0
  }
];

module.exports = dummyCategories;
