const express = require("express");
const router = express.Router();
const smartcarController = require("../controllers/smartCarController");
const checkSmartcarToken = require("../middlewares/checkSmartcarToken");

router.get("/login", smartcarController.getAuthUrl);
router.get("/callback", smartcarController.handleAuthCallback);
router.get(
  "/vehicle-info",
  checkSmartcarToken,
  smartcarController.getVehicleInfo
);

module.exports = router;
