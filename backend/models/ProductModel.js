const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
  }, { timestamps: true });
  
  // Export the model directly
  const ProductModel = mongoose.model("products", productSchema);
  module.exports = ProductModel;
  
 