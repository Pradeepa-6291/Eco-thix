const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    certifications: [{ type: String }],
    description: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sustainabilityRating: { type: Number, default: 0, min: 0, max: 100 },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Supplier', supplierSchema);
