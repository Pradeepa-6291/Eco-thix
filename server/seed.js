require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Supplier = require('./models/Supplier');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB...');

  await User.deleteMany();
  await Product.deleteMany();
  await Supplier.deleteMany();

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@ecothix.com',
    password: 'admin123',
    role: 'admin',
    ecoCredits: 500,
    treesPlanted: 50,
    carbonOffset: 250,
  });

  // Create supplier user
  const supplierUser = await User.create({
    name: 'Green Supplier',
    email: 'supplier@ecothix.com',
    password: 'supplier123',
    role: 'supplier',
    ecoCredits: 200,
  });

  // Create regular user
  await User.create({
    name: 'Eco Shopper',
    email: 'user@ecothix.com',
    password: 'user123',
    role: 'user',
    ecoCredits: 100,
    treesPlanted: 5,
    carbonOffset: 25,
  });

  // Create suppliers
  const supplier1 = await Supplier.create({
    name: 'EcoWear Co.',
    location: 'Portland, Oregon',
    certifications: ['Fair Trade', 'B-Corp', 'GOTS Organic'],
    description: 'Leading sustainable fashion brand using 100% organic materials.',
    userId: supplierUser._id,
    sustainabilityRating: 95,
    verified: true,
  });

  const supplier2 = await Supplier.create({
    name: 'GreenHome Essentials',
    location: 'Amsterdam, Netherlands',
    certifications: ['EU Ecolabel', 'Cradle to Cradle', 'FSC Certified'],
    description: 'Eco-friendly home products made from recycled and natural materials.',
    userId: supplierUser._id,
    sustainabilityRating: 88,
    verified: true,
  });

  const supplier3 = await Supplier.create({
    name: 'SolarTech Innovations',
    location: 'Berlin, Germany',
    certifications: ['ISO 14001', 'Energy Star', 'RoHS Compliant'],
    description: 'Renewable energy powered tech products with minimal carbon footprint.',
    userId: supplierUser._id,
    sustainabilityRating: 82,
    verified: true,
  });

  // Create products
  await Product.insertMany([
    {
      name: 'Organic Cotton T-Shirt',
      description: 'Soft, breathable t-shirt made from 100% GOTS certified organic cotton. Dyed with natural plant-based dyes.',
      price: 45.00,
      oldPrice: 65.00,
      category: 'fashion',
      sustainabilityScore: 92,
      fairTradeBadges: ['Fair Trade', 'Organic', 'Vegan'],
      supplierId: supplier1._id,
      carbonSaved: 22.5,
      stock: 50,
      badge: 'Best Seller',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    },
    {
      name: 'Recycled Ocean Plastic Sneakers',
      description: 'Stylish sneakers crafted from 100% recycled ocean plastic bottles. Each pair removes 11 plastic bottles from the ocean.',
      price: 89.00,
      oldPrice: 120.00,
      category: 'fashion',
      sustainabilityScore: 88,
      fairTradeBadges: ['Ocean Positive', 'Recycled Materials'],
      supplierId: supplier1._id,
      carbonSaved: 44.5,
      stock: 30,
      badge: 'Eco Choice',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
    },
    {
      name: 'Bamboo Fiber Wallet',
      description: 'Slim, durable wallet made from sustainable bamboo fiber. Naturally antibacterial and biodegradable.',
      price: 35.00,
      category: 'fashion',
      sustainabilityScore: 95,
      fairTradeBadges: ['Bamboo Certified', 'Biodegradable'],
      supplierId: supplier1._id,
      carbonSaved: 17.5,
      stock: 100,
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
    },
    {
      name: 'Solar-Powered Desk Lamp',
      description: 'Energy-efficient LED desk lamp with built-in solar panel. Charges during the day, lights up at night.',
      price: 65.00,
      category: 'tech',
      sustainabilityScore: 85,
      fairTradeBadges: ['Solar Powered', 'Energy Star'],
      supplierId: supplier3._id,
      carbonSaved: 32.5,
      stock: 25,
      badge: 'New',
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
    },
    {
      name: 'Bamboo Cutlery Set',
      description: 'Complete 5-piece bamboo cutlery set in a natural cotton pouch. Perfect zero-waste alternative to plastic cutlery.',
      price: 22.00,
      category: 'home',
      sustainabilityScore: 98,
      fairTradeBadges: ['Zero Waste', 'Compostable', 'FSC Certified'],
      supplierId: supplier2._id,
      carbonSaved: 11.0,
      stock: 200,
      badge: 'Eco Choice',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
    },
    {
      name: 'Stainless Steel Water Bottle',
      description: 'Double-walled insulated bottle keeps drinks cold 24hrs or hot 12hrs. Made from food-grade recycled stainless steel.',
      price: 32.00,
      oldPrice: 45.00,
      category: 'home',
      sustainabilityScore: 93,
      fairTradeBadges: ['BPA Free', 'Recycled Steel', 'Lifetime Warranty'],
      supplierId: supplier2._id,
      carbonSaved: 16.0,
      stock: 75,
      badge: 'Sale',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    },
    {
      name: 'Hemp Canvas Backpack',
      description: 'Durable 25L backpack made from organic hemp canvas. Naturally water-resistant and incredibly strong.',
      price: 78.00,
      category: 'fashion',
      sustainabilityScore: 91,
      fairTradeBadges: ['Organic Hemp', 'Fair Trade'],
      supplierId: supplier1._id,
      carbonSaved: 39.0,
      stock: 40,
      badge: 'New',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    },
    {
      name: 'Recycled Glass Candle Set',
      description: 'Set of 3 hand-poured soy wax candles in recycled glass jars. Scented with pure essential oils.',
      price: 48.00,
      category: 'home',
      sustainabilityScore: 89,
      fairTradeBadges: ['Soy Wax', 'Recycled Glass', 'Essential Oils'],
      supplierId: supplier2._id,
      carbonSaved: 24.0,
      stock: 60,
      image: 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400',
    },
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('\n📧 Test Accounts:');
  console.log('Admin:    admin@ecothix.com    / admin123');
  console.log('Supplier: supplier@ecothix.com / supplier123');
  console.log('User:     user@ecothix.com     / user123');

  mongoose.disconnect();
};

seed().catch((err) => { console.error(err); process.exit(1); });
