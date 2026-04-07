const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['fashion', 'home', 'tech', 'beauty', 'food', 'other'],
    },
    sustainabilityScore: { type: Number, required: true, min: 0, max: 100 },
    fairTradeBadges: [{ type: String }],
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    carbonSaved: { type: Number, default: 0 },
    treesPlanted: { type: Number, default: 0 },
    ecoCredits: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    image: { type: String, default: '' },
    oldPrice: { type: Number },
    badge: { type: String, enum: ['Best Seller', 'Eco Choice', 'New', 'Sale', ''], default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
