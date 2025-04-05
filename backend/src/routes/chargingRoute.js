const express = require("express");
const controllers = require("../controllers/chargingController");
const checkSmartcarToken = require("../middlewares/checkSmartcarToken");
const router = express.Router();

router.get(
  "/findCharging",
  checkSmartcarToken,
  controllers.getChargingStations
);
router.get("/summaryinfo/:id", checkSmartcarToken, controllers.summaryinfo);
router.get("/fullinfo/:id", checkSmartcarToken, controllers.fullinfo);

module.exports = router;
