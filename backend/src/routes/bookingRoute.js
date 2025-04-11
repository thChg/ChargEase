const express = require("express");
const controllers = require("../controllers/bookingController");
const authMiddleware = require("../middlewares/clerk");
const router = express.Router();

router.post("/", authMiddleware, controllers.createBooking);

router.get("/getHistory", authMiddleware, controllers.getBookingHistory);

router.patch("/cancelBooking/:id", authMiddleware, controllers.cancelBooking);

module.exports = router;
