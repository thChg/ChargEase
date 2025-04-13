const express = require("express");
const controllers = require("../controllers/chargingController");
const checkSmartcarToken = require("../middlewares/checkSmartcarToken");
const authMiddleware = require("../middlewares/clerk");
const router = express.Router();

router.get("/findCharging", authMiddleware, controllers.getChargingStations);
router.get("/summaryinfo/:id", authMiddleware, controllers.summaryinfo);
router.get("/fullinfo/:id", authMiddleware, controllers.fullinfo);

module.exports = router;
