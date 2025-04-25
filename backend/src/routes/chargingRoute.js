const express = require("express");
const controllers = require("../controllers/chargingController");
const router = express.Router();

router.get("/findCharging/:userID", controllers.getChargingStations);
router.get("/summaryinfo/:id", controllers.summaryinfo);
router.get("/fullinfo/:id", controllers.fullinfo);

module.exports = router;
