const Comment = require("../models/comment");
const ChargingStation = require("../models/chargingStation");
const clerkClient = require("../utils/clerk");
const User = require("../models/users");

// API thêm bình luận
module.exports.comment = async (req, res) => {
  try {
    const { comment, star } = req.body;
    const { stationId } = req.params;
    const clerkUserId = req.auth.userId;

    if (!clerkUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 1. Tìm user trong database bằng clerkUserId
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const username = clerkUser.username;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Kiểm tra station có tồn tại không
    const station = await ChargingStation.findById(stationId);
    if (!station) {
      return res.status(404).json({ message: "Trạm sạc không tồn tại" });
    }
    console.log("tessssssssssssss");

    // 2. Kiểm tra comment không được trống (NEW LOGIC)
    if (!comment || comment.trim() === "") {
      return res.status(400).json({
        message: "Nội dung bình luận không được để trống",
      });
    }

    // 3. Kiểm tra số sao hợp lệ (nếu cần)
    if (star < 1 || star > 5) {
      return res.status(400).json({
        message: "Đánh giá sao phải từ 1 đến 5",
      });
    }

    // 4. Tạo comment mới
    const newComment = new Comment({
      stationId,
      userId: user._id,
      comment: comment.trim(), // Loại bỏ khoảng trắng thừa
      star,
    });

    await newComment.save();

    res.json({
      message: "Thêm bình luận thành công",
      comment: newComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi thêm bình luận" });
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
