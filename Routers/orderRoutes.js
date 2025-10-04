const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

// Guest order creation (no auth required)
router.post('/guest', orderController.createGuestOrder);

// Order tracking by order number (no auth required)
router.get('/track/:orderNumber', orderController.getOrderByNumber);

// Admin routes for order management
router.get('/status/:status', orderController.getOrdersByStatus);
router.patch('/:id/status', orderController.updateOrderStatus);

// Standard CRUD routes
router
  .route('/')
  .get(orderController.getOrders)
  .post(orderController.createOrder);

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

module.exports = router;
