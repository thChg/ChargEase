const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chargingstations",
    required: true,
  }, // Liên kết với trạm sạc
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  comment: { type: String, required: true },
  star: { type: Number, required: true, min: 1, max: 5 }, // Đánh giá từ 1-5 sao
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("comments", CommentSchema, "comments");
