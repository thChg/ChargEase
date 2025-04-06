const Comment = require("../models/comment");
const ChargingStation = require("../models/chargingStation");

// API thêm bình luận
module.exports.comment = async (req, res) => {
  try {
    const { comment, star } = req.body;
    const { stationId } = req.params;

    // Kiểm tra station có tồn tại không
    const station = await ChargingStation.findById(stationId);
    if (!station) {
      return res.status(404).json({ message: "Charging station not found" });
    }

    // Tạo comment mới
    const newComment = new Comment({ stationId, comment, star });
    await newComment.save();

    res.json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getComment = async (req, res) => {
  try {
    const { stationId } = req.params;
    const comments = await Comment.find({ stationId });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
