const express = require("express");
const router = express.Router();
const {
  createAccountInfo,
  updateAccountInfo,
  getAccountInfo,
} = require("../controllers/accountInfoController");

router.post("/", createAccountInfo);
router.put("/:id", updateAccountInfo);
router.get("/:id", getAccountInfo);

module.exports = router;
