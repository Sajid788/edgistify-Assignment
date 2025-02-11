const ProductModel = require("../models/ProductModel");

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { name, price, stock,image } = req.body;

    // Validate input fields
    if (!name || !price || !stock || !image) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newProduct = new ProductModel({ name, price, stock,image});
    await newProduct.save();

    return res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    // `lean()` improves read performance
    const products = await ProductModel.find().lean();
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { name, price, stock },
      { new: true, runValidators: true, lean: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res
      .status(200)
      .json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
