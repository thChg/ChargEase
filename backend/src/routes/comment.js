const express = require("express");
const controllers = require("../controllers/commentController");
const router = express.Router();

router.post("/:stationId", controllers.comment);

router.delete(
  "/deleteComment/:stationId",
  controllers.deleteComment
);

router.get("/:stationId", controllers.getComment);

module.exports = router;
