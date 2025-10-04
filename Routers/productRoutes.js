const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Special routes
router.get('/featured', productController.getFeaturedProducts);
router.get('/new-arrivals', productController.getNewArrivals);
router.get('/search', productController.searchProducts);
router.get('/stats', productController.getProductStats);
router.get('/category/:categoryId', productController.getProductsByCategory);

// Main CRUD routes
router
  .route('/')
  .get(productController.getProducts)
  .post(productController.uploadProductImages, productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.uploadProductImages, productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
