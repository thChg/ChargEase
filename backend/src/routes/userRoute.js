const express = require("express");
const controllers = require("../controllers/userController");
const router = express.Router();

router.post(
  "/favoriteCharger/:id",
  controllers.addFavoriteCharger
);

router.post(
  "/delFavouriteCharger/:id",
  controllers.removeFavoriteCharger
);

router.post("/update-usedSlot/:id", controllers.updateUsedSlot);

module.exports = router;
