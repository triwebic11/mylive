const express = require("express");

const router = express.Router();
const {
  getRanksRequest,
  RankUpdateRequest

} = require("../controllers/RankUpgradeRequestcontrol");

router.get("/", getRanksRequest);
router.patch("/:id", RankUpdateRequest);


module.exports = router;

