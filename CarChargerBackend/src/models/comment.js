const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChargingStation",
    required: true,
  }, // Liên kết với trạm sạc
  comment: { type: String, required: true },
  star: { type: Number, required: true, min: 1, max: 5 }, // Đánh giá từ 1-5 sao
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);
