const Order = require('../models/Order');
const User = require('../models/User');

// @POST /api/orders
const placeOrder = async (req, res) => {
  const { products, totalAmount, shippingAddress, paymentMethod } = req.body;
  if (!products?.length) return res.status(400).json({ message: 'No products in order' });

  const carbonSaved = +(totalAmount * 0.5).toFixed(2);
  const ecoCreditsEarned = Math.floor(totalAmount / 10);
  const treesPlanted = Math.floor(totalAmount / 20);

  const order = await Order.create({
    userId: req.user._id,
    products,
    totalAmount,
    carbonSaved,
    ecoCreditsEarned,
    treesPlanted,
    shippingAddress,
    paymentMethod: paymentMethod || 'card',
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
  });

  await User.findByIdAndUpdate(req.user._id, {
    $inc: { ecoCredits: ecoCreditsEarned, treesPlanted, carbonOffset: carbonSaved },
  });

  res.status(201).json(order);
};

// @GET /api/orders/my
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// @GET /api/orders  (admin)
const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
  res.json(orders);
};

// @PUT /api/orders/:id/status  (admin)
const updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus };
