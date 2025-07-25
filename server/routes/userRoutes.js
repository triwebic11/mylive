const express = require("express");

const router = express.Router();
const {
  registerUser,
  loginUser,
  getMyReferrals,
  getReferralTreeDetails,
  getMyAllReferrals,
  updateUserPassword,
  getAllUsers,
  getUserById,
  updatProfileInfo,
  updateUserRole,
  userAgregateData,
  submitKycImages,
  getUserKycById,
  getReferralTreeById,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/my-referrals/:refCode", getMyReferrals);
router.get("/my-referrals/", getMyAllReferrals);
router.post("/referral-tree", getReferralTreeDetails);
router.get("/referral-tree/:userId", getReferralTreeById);

router.put("/update-password/:userId", updateUserPassword);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updatProfileInfo);
router.get("/admin/all-users", getAllUsers);
router.get("/admin/user/:id", getUserById);
router.patch("/updaterole/:id", updateUserRole);
router.get("/userAgregateData/:id", userAgregateData);
// router.post("/kyc", submitKycImages);
// router.get("/kyc/:id", getUserKycById);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { registerUser, getUsers,loginUser ,getdatafromReferId,getMyReferrals,getMyAllReferrals,getReferralTreeDetails} = require("../controllers/userController");

// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.get("/all", getUsers);
// router.get("/:referId/downlines", getdatafromReferId);
// router.get("/my-referrals/:refCode", getMyReferrals);
// router.get("/my-referrals/", getMyAllReferrals);
// router.post("/referral-tree", getReferralTreeDetails);

// module.exports = router;
