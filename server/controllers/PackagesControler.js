


const Packages = require("../models/PackagesModel");
// Get All Products
exports.getAllPackages = async (req, res) => {
  try {
    const products = await Packages.find();
    console.log("Fetched products:", products);
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updatePackages = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedProduct = await Packages.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Package updated successfully',
      package: updatedProduct,
    });
  } catch (error) {
    console.error('Patch update failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

