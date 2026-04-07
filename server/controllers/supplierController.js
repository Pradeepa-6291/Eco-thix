const Supplier = require('../models/Supplier');

// @GET /api/suppliers
const getSuppliers = async (req, res) => {
  const suppliers = await Supplier.find().populate('userId', 'name email');
  res.json(suppliers);
};

// @GET /api/suppliers/:id
const getSupplier = async (req, res) => {
  const supplier = await Supplier.findById(req.params.id).populate('userId', 'name email');
  if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
  res.json(supplier);
};

// @POST /api/suppliers
const createSupplier = async (req, res) => {
  const supplier = await Supplier.create({ ...req.body, userId: req.user._id });
  res.status(201).json(supplier);
};

// @PUT /api/suppliers/:id
const updateSupplier = async (req, res) => {
  const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
  res.json(supplier);
};

module.exports = { getSuppliers, getSupplier, createSupplier, updateSupplier };
