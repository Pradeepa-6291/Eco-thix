const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 },
        image: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    carbonSaved: { type: Number, default: 0 },
    ecoCreditsEarned: { type: Number, default: 0 },
    treesPlanted: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: { type: String },
    paymentMethod: { type: String, enum: ['card', 'cod'], default: 'card' },
    paymentStatus: { type: String, enum: ['paid', 'pending'], default: 'paid' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
