const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin, supplierOrAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/my', protect, getMyOrders);
router.get('/all', protect, supplierOrAdmin, getAllOrders);
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, supplierOrAdmin, updateOrderStatus);

module.exports = router;
