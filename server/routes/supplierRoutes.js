const express = require('express');
const router = express.Router();
const { getSuppliers, getSupplier, createSupplier, updateSupplier } = require('../controllers/supplierController');
const { protect, supplierOrAdmin } = require('../middleware/authMiddleware');

router.get('/', getSuppliers);
router.get('/:id', getSupplier);
router.post('/', protect, supplierOrAdmin, createSupplier);
router.put('/:id', protect, supplierOrAdmin, updateSupplier);

module.exports = router;
