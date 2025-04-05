const mongoose = require("mongoose");

const ChargingStationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  address: { type: String, required: true },
  slot: { type: Number, required: true }, // Tổng số khe sạc
  usedSlot: { type: Number, required: true, default: 0 }, // Số khe đã sử dụng
  introduce: { type: String, required: true },
  fee: { type: Number, required: true },
  workingHours: { type: String, required: true },
  amenities: {
    type: [String], // Mảng các tiện ích
    default: [], // Mặc định là mảng rỗng
  },
});

module.exports = mongoose.model(
  "chargingstations",
  ChargingStationSchema,
  "chargingstations"
);
