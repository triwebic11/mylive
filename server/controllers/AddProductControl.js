// controllers/productController.js
const Product = require("../models/AddProduct");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, image, details, price, pointValue } = req.body;

    if (!name || !image || !details || !price || !pointValue) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newProduct = new Product({
      name,
      image,
      details,
      price,
      pointValue,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (err) {
    console.error("Create Product Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
