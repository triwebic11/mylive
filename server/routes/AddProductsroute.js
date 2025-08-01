// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductsByRole
} = require("../controllers/AddProductControl");

router.post("/product", createProduct);
router.get("/product", getAllProducts);
router.get("/product/:role", getProductsByRole);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
