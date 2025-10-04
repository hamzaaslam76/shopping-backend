const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// Special routes
router.get('/featured', categoryController.getFeaturedCategories);
router.get('/stats', categoryController.getCategoryStats);
router.get('/gender/:gender', categoryController.getCategoriesByGender);

// Main CRUD routes
router
  .route('/')
  .get(categoryController.getCategories)
  .post(categoryController.uploadCategoryImage, categoryController.createCategory);

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.uploadCategoryImage, categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
