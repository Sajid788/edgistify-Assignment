
const express = require("express");
const {
  getCart,
  addCart,
  updateCart,
  removeCart,
} = require("../controller/CartController");
const { protect } = require("../middleware/authentication");

const cartRouter = express.Router();
cartRouter.post("/add", protect, addCart);
cartRouter.get("/", protect, getCart);
cartRouter.put("/update-/:productId", protect, updateCart);
cartRouter.delete("/remove/:productId", protect, removeCart);

module.exports = {cartRouter};
