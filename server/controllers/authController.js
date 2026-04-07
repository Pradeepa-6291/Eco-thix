const User = require('../models/User');
const generateToken = require('../middleware/generateToken');

// @POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password, role: role || 'user' });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    ecoCredits: user.ecoCredits,
    treesPlanted: user.treesPlanted,
    carbonOffset: user.carbonOffset,
    token: generateToken(user._id),
  });
};

// @POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    ecoCredits: user.ecoCredits,
    treesPlanted: user.treesPlanted,
    carbonOffset: user.carbonOffset,
    token: generateToken(user._id),
  });
};

// @GET /api/auth/profile
const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// @GET /api/auth/users  (admin)
const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

module.exports = { register, login, getProfile, getAllUsers };
