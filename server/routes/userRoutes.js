const express = require("express");
const router = express.Router();
const { registerUser, getUsers,loginUser } = require("../controllers/userController");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", getUsers);





module.exports = router;
