const express = require("express");
const { getChargingStations } = require("../controllers/chargingController");
const authMiddleware = require("../middlewares/clerk");
const router = express.Router();

router.get("/findCharging", getChargingStations);

module.exports = router;
