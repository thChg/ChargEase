const express = require("express");
const router = express.Router();
const smartcarController = require("../controllers/smartCarController");

router.get("/login", smartcarController.getAuthUrl);
router.get("/callback", smartcarController.handleAuthCallback);
router.get("/vehicle-info", smartcarController.getVehicleInfo);

module.exports = router;
