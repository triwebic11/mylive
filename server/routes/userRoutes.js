const express = require("express");
const router = express.Router();
const { registerUser, getUsers,loginUser ,getdatafromReferId} = require("../controllers/userController");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", getUsers);
router.get("/:referId/downlines", getdatafromReferId);


module.exports = router;
