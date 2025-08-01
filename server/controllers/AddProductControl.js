// controllers/productController.js
const Product = require("../models/AddProduct");

// Create Product

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      details,
      price,
      mrpPrice,
      pointValue,
      productId,
      isRepurchaseFree = false,
      isConsistencyFree = false,
      rfp,
      acfp,

      // advanceConsistency = "No",
      // addConsistencyFreeProduct = "No",
    } = req.body;

    // // Validation
    // if (
    //   !name ||
    //   !image ||
    //   !details ||
    //   !price ||
    //   !mrpPrice ||
    //   !pointValue ||
    //   !productId ||
    //   !rfp ||
    //   !acfp
    // ) {
    //   return res
    //     .status(400)
    //     .json({ message: "All required fields must be filled." });
    // }

    const newProduct = new Product({
      name,
      image,
      details,
      price,
      mrpPrice,
      pointValue,
      productId,
      isRepurchaseFree,
      isConsistencyFree,
      rfp,
      acfp,
      // advanceConsistency,
      // addConsistencyFreeProduct,
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
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
// controllers/productController.js
exports.getProductsByRole = async (req, res) => {
  const { role } = req.params;

  try {
    const products = await Product.find({ productRole: role });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Patch update failed:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully", product: deleted });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
