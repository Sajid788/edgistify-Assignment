const OrderModel = require("../models/OrderModel");
const CartModel = require("../models/CartModel");
const ProductModel = require("../models/ProductModel");

const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await CartModel.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate  calculate total
    let totalPrice = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await ProductModel.findById(item.product._id);

      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock ${
            product ? product.name : "product"
          }`,
        });
      }

      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      });

      totalPrice += item.product.price * item.quantity;
    }

    const order = await OrderModel.create({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      shippingAddress,
    });

    cart.items = [];
    await cart.save();

    await order.populate("items.product user");

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
};

 // Fetch all orders 
const getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 }); 

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};

module.exports = {createOrder, getOrders}