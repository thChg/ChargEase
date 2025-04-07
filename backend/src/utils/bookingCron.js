const cron = require("node-cron");
const Booking = require("../models/booking");
const ChargingStation = require("../models/ChargingStation");

// Hàm tự động cập nhật trạng thái booking
const updateCompletedBookings = async () => {
  try {
    const now = new Date();

    // 1. Tìm các booking đã hết hạn nhưng chưa hoàn thành
    const expiredBookings = await Booking.find({
      status: "confirmed",
      endTime: { $lte: now }, // endTime đã qua
    });

    if (expiredBookings.length === 0) {
      console.log("Không có booking nào cần cập nhật.");
      return;
    }

    // 2. Cập nhật trạng thái và giải phóng slot trạm
    for (const booking of expiredBookings) {
      // Cập nhật trạng thái
      booking.status = "completed";
      await booking.save();

      // Giảm usedSlot của trạm
      const station = await ChargingStation.findById(booking.stationId);
      if (station) {
        station.usedSlot = Math.max(0, station.usedSlot - 1);
        await station.save();
      }

      console.log(`Đã cập nhật booking ${booking._id} sang "completed".`);
    }
  } catch (error) {
    console.error("Lỗi cron job:", error);
  }
};

// Lên lịch chạy mỗi phút
cron.schedule("* * * * *", updateCompletedBookings);

// Xuất hàm để có thể gọi thủ công nếu cần
module.exports = updateCompletedBookings;
