// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
 getAllPackages,
 updatePackages,
} = require("../controllers/PackagesControler");

router.get("/", getAllPackages);
router.patch("/:id", updatePackages);

module.exports = router;
