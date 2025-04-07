const express = require("express");
const controllers = require("../controllers/commentController");
const authMiddleware = require("../middlewares/clerk");
const router = express.Router();

router.post("/:stationId", authMiddleware, controllers.comment);

router.delete(
  "/deleteComment/:stationId",
  authMiddleware,
  controllers.deleteComment
);

router.get("/:stationId", authMiddleware, controllers.getComment);

module.exports = router;
