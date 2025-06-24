const express = require("express");
const router = express.Router();
const { registerUser, getUsers,loginUser,getMyReferrals } = require("../controllers/userController");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", getUsers);
router.get("/my-referrals/:userId", getMyReferrals);





module.exports = router;
