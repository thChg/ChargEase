const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
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
  energyConsumed: {
    type: Number,
    default: 0,
  },
  paymentMethod: {
    type: String,
    enum: ["momo", "credit_card", "cash"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("bookings", BookingSchema, "bookings");
