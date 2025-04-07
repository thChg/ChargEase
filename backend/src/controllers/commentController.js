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

//API xóa bình luận
module.exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params; // Lấy commentId từ params

    // Tìm và xóa comment trong cơ sở dữ liệu
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({
      message: "Comment deleted successfully",
      deletedComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// xem tất cả các comment của 1 trạm xạc
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
