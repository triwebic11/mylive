
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMyReferrals,
  getReferralTreeDetails,
  getMyAllReferrals,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/my-referrals/:refCode", getMyReferrals);
router.get("/my-referrals/", getMyAllReferrals);
router.post("/referral-tree", getReferralTreeDetails);

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
