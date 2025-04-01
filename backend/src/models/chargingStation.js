const mongoose = require("mongoose");

const ChargingStationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  address: { type: String, required: true },
  distance: { type: String, required: true },
  status: { type: String, enum: ["available", "unavailable"], required: true },
});

module.exports = mongoose.model("ChargingStation", ChargingStationSchema);
