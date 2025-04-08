const cron = require("node-cron");
const mongoose = require("mongoose");

// Sử dụng singleton pattern để tránh lỗi OverwriteModelError
const Booking = mongoose.models.Booking || require("../models/booking");
const ChargingStation =
  mongoose.models.ChargingStation || require("../models/chargingStation");

const updateCompletedBookings = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const now = new Date();
    console.log(`[${now.toISOString()}] Bắt đầu kiểm tra booking hết hạn...`);

    // 1. Tìm và cập nhật booking trong một transaction
    const expiredBookings = await Booking.find({
      status: "confirmed",
      endTime: { $lte: now },
    }).session(session);

    if (expiredBookings.length === 0) {
      console.log("Không có booking nào cần cập nhật.");
      await session.commitTransaction();
      return;
    }

    // 2. Cập nhật hàng loạt hiệu quả hơn
    const bookingIds = expiredBookings.map((b) => b._id);
    const stationIds = [...new Set(expiredBookings.map((b) => b.stationId))]; // Lấy unique stationIds

    // Cập nhật tất cả booking cùng lúc
    await Booking.updateMany(
      { _id: { $in: bookingIds } },
      { $set: { status: "completed" } }
    ).session(session);

    // Cập nhật tất cả trạm cùng lúc
    await ChargingStation.updateMany(
      { _id: { $in: stationIds } },
      { $inc: { usedSlot: -1 } }
    ).session(session);

    await session.commitTransaction();
    console.log(
      `Đã cập nhật ${expiredBookings.length} booking sang "completed".`
    );
  } catch (error) {
    await session.abortTransaction();
    console.error("Lỗi cron job:", error);
  } finally {
    session.endSession();
  }
};

// Lên lịch chạy mỗi phút
cron.schedule("* * * * *", () => {
  updateCompletedBookings().catch(console.error);
});

// Xuất hàm để có thể gọi thủ công
module.exports = updateCompletedBookings;
