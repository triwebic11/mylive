// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  getStore,
  AddAdminStoreData,
  getStoresummery,
} = require("../controllers/AdminStoreController");

router.get("/", getStore);
router.get("/getsummery", getStoresummery);
router.post("/post", AddAdminStoreData);

module.exports = router;
