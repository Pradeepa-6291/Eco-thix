const Product = require('../models/Product');

// @GET /api/products
const getProducts = async (req, res) => {
  const { category, minScore, search } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (minScore) filter.sustainabilityScore = { $gte: Number(minScore) };
  if (search) filter.name = { $regex: search, $options: 'i' };

  const products = await Product.find(filter).populate('supplierId', 'name location certifications');
  res.json(products);
};

// @GET /api/products/:id
const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('supplierId');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// @POST /api/products
const createProduct = async (req, res) => {
  const {
    name, description, price, category,
    sustainabilityScore, fairTradeBadges,
    stock, image, oldPrice, badge,
    carbonSaved, treesPlanted, ecoCredits,
  } = req.body;

  if (!name || !description || !price || !category || sustainabilityScore === undefined) {
    return res.status(400).json({ message: 'name, description, price, category and sustainabilityScore are required' });
  }

  if (image && image.trim() !== '') {
    try { new URL(image); } catch {
      return res.status(400).json({ message: 'Invalid image URL format' });
    }
  }

  const product = await Product.create({
    name,
    description,
    price: Number(price),
    category,
    sustainabilityScore: Number(sustainabilityScore),
    fairTradeBadges: fairTradeBadges || [],
    stock: Number(stock) || 0,
    image: image?.trim() || '',
    oldPrice: oldPrice ? Number(oldPrice) : undefined,
    badge: badge || '',
    carbonSaved: carbonSaved ? Number(carbonSaved) : 0,
    treesPlanted: treesPlanted ? Number(treesPlanted) : 0,
    ecoCredits: ecoCredits ? Number(ecoCredits) : 0,
  });

  console.log(`✅ Product created: "${product.name}" | 🌍 CO₂: ${product.carbonSaved}kg | 🌳 Trees: ${product.treesPlanted} | 🌱 Credits: ${product.ecoCredits}`);
  res.status(201).json(product);
};

// @PUT /api/products/:id
const updateProduct = async (req, res) => {
  if (req.body.image && req.body.image.trim() !== '') {
    try { new URL(req.body.image); } catch {
      return res.status(400).json({ message: 'Invalid image URL format' });
    }
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { ...req.body, image: req.body.image?.trim() || '' },
    { new: true, runValidators: true }
  );
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// @DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
