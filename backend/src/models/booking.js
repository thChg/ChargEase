const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chargingstations",
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  totalCost: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("bookings", BookingSchema, "bookings");
