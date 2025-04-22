const express = require("express");
const controllers = require("../controllers/bookingController");
const router = express.Router();

router.post("/", controllers.createBooking);

router.get("/getHistory", controllers.getBookingHistory);

router.patch("/cancelBooking/:id", controllers.cancelBooking);

module.exports = router;
