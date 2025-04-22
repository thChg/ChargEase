const express = require("express");
const controllers = require("../controllers/userController");
const router = express.Router();

router.post(
  "/favoriteCharger/:id",
  controllers.addFavoriteCharger
);

router.delete(
  "/delFarvorCharger/:id",
  controllers.removeFavoriteCharger
);

router.post("/update-usedSlot/:id", controllers.updateUsedSlot);

module.exports = router;
