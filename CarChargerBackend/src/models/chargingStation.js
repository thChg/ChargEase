const mongoose = require("mongoose");

const ChargingStationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  address: { type: String, required: true },
  distance: { type: String, required: true },
  status: { type: String, enum: ["available", "unavailable"], required: true },
  slot: { type: Number, required: true }, // Tổng số khe sạc
  usedSlot: { type: Number, required: true, default: 0 }, // Số khe đã sử dụng
});

module.exports = mongoose.model(
  "chargingstations",
  ChargingStationSchema,
  "chargingstations"
);
