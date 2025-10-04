const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

// Product routes for customer app
router.get('/products', customerController.getCustomerProducts);
router.get('/products/featured', customerController.getFeaturedProducts);
router.get('/products/new-arrivals', customerController.getNewArrivals);
router.get('/products/recommended', customerController.getRecommendedProducts);
router.get('/products/hacfoods', customerController.getHacFoodsProducts);
router.get('/products/search', customerController.searchProducts);
router.get('/products/stats', customerController.getProductStats);
router.get('/products/category/:categoryId', customerController.getProductsByCategory);
router.get('/products/:id', customerController.getCustomerProduct);

// Category routes for customer app
router.get('/categories', customerController.getCustomerCategories);
router.get('/categories/featured', customerController.getFeaturedCategories);

// Order routes for customer app
router.post('/orders/guest', customerController.createGuestOrder);
router.get('/orders/track/:orderNumber', customerController.getOrderByNumber);

module.exports = router;
