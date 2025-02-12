const CartModel = require("../models/CartModel");
const ProductModel = require("../models/ProductModel");

// get a cart
const getCart = async (req, res, next) => {
  try {
    let cart = await CartModel.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) cart = await CartModel.create({ user: req.user._id, items: [], total: 0 });
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// add a cart
const addCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const product = await ProductModel.findById(productId);
    if (!product || product.stock < quantity) return res.status(400).json({ message: "Invalid product or stock" });

    let cart = await CartModel.findOne({ user: req.user._id });
    if (!cart) cart = await CartModel.create({ user: req.user._id, items: [], total: 0 });

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    existingItem ? (existingItem.quantity += quantity) : cart.items.push({ product: productId, quantity });

    cart.total = cart.items.reduce((total, item) => total + item.quantity * product.price, 0);
    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// uodate a cart
const updateCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await CartModel.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    const product = await ProductModel.findById(productId);
    if (product.stock < quantity) return res.status(400).json({ message: "Not enough stock" });

    item.quantity = quantity;
    cart.total = cart.items.reduce((total, item) => total + item.quantity * product.price, 0);

    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
};


// delete a cart
const removeCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await CartModel.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    cart.total = cart.items.reduce((total, item) => total + item.quantity * item.product.price, 0);

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addCart, updateCart, removeCart };
