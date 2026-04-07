const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
} = require('../controllers/productController');
const { protect, supplierOrAdmin, admin } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, supplierOrAdmin, createProduct);
router.put('/:id', protect, supplierOrAdmin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
