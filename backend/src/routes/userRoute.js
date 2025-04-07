const express = require("express");
const controllers = require("../controllers/userController");
const authMiddleware = require("../middlewares/clerk");
const router = express.Router();

router.get("/info", authMiddleware, controllers.getUserInfo);

router.post(
  "/favoriteCharger/:id",
  authMiddleware,
  controllers.addFavoriteCharger
);

router.delete(
  "/delFarvorCharger/:id",
  authMiddleware,
  controllers.removeFavoriteCharger
);

router.post("/update-usedSlot/:id", authMiddleware, controllers.updateUsedSlot);

module.exports = router;
