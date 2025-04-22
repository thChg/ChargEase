const Booking = require("../models/booking");
const ChargingStation = require("../models/chargingStation");

// tao booking
module.exports.createBooking = async (req, res) => {
  try {
    const { userId, stationId, startTime, endTime, paymentMethod } = req.body;

    // 1. Chuyển đổi sang giờ VN (UTC+7) để so sánh
    const getVnTime = (date) => {
      const d = new Date(date);
      return new Date(d.getTime() + 7 * 60 * 60 * 1000); // +7 giờ
    };

    console.log(startTime);
    console.log(endTime);

    const currentVnTime = getVnTime(new Date());
    const startVnTime = getVnTime(new Date(startTime));
    const endVnTime = getVnTime(new Date(endTime));

    console.log("Current VN Time:", currentVnTime.toISOString());
    console.log("Start VN Time:", startVnTime.toISOString());
    console.log("End VN Time:", endVnTime.toISOString());

    // 2. Validate thời gian (so sánh bằng timestamp)
    if (startVnTime.getTime() < currentVnTime.getTime()) {
      return res
        .status(400)
        .json({ message: "Thời gian bắt đầu không được trong quá khứ" });
    }

    if (endVnTime.getTime() <= startVnTime.getTime()) {
      return res
        .status(400)
        .json({ message: "Thời gian kết thúc phải sau thời gian bắt đầu" });
    }

    // 3. Kiểm tra trạm
    const station = await ChargingStation.findById(stationId);
    if (!station) {
      return res.status(404).json({ message: "Trạm sạc không tồn tại" });
    }

    // 4. Check overlapping (chuyển đổi điều kiện sang VN time)
    const overlappingBookings = await Booking.find({
      stationId,
      status: { $in: ["confirmed", "pending"] },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });

    if (overlappingBookings.length >= station.slot) {
      return res.status(400).json({
        message: `Trạm đã hết slot từ ${convertToVnTime(
          startTime
        )} đến ${convertToVnTime(endTime)}`,
      });
    }

    // 5. Tính toán giá
    const durationHours = (endVnTime - startVnTime) / (1000 * 60 * 60);
    const totalCost = station.baseFee * durationHours;

    // 6. Tạo booking (lưu thời gian dạng UTC trong DB)
    const booking = new Booking({
      userId,
      stationId,
      startTime: new Date(startTime), // Lưu nguyên bản (đã validate ISO 8601)
      endTime: new Date(endTime),
      totalCost,
      paymentMethod,
      status: "confirmed",
    });

    await booking.save();
    station.usedSlot = overlappingBookings.length + 1;
    await station.save();

    return res.status(201).json({
      bookingId: booking._id,
      status: booking.status,
      totalCost,
      stationName: station.name,
      timeInfo: {
        startTime: startVnTime.toISOString(),
        endTime: endVnTime.toISOString(),
      },
    });
  } catch (error) {
    console.error("[Booking Error]", error);
    return res.status(500).json({
      message: "Lỗi hệ thống khi tạo booking",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// lay lish su booking
module.exports.getBookingHistory = async (req, res) => {
  try {
    const { userId, status } = req.query;
    const filter = { userId };

    // Nếu status không phải là "all", thêm điều kiện vào filter
    if (status && status !== "all") {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate("stationId", "name address") // Chỉ lấy name và address của trạm
      .sort({ createdAt: -1 });

    res.status(200).json({
      bookings: bookings.map((booking) => ({
        bookingId: booking._id,
        stationName: booking.stationId.name,
        stationAddress: booking.stationId.address,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        totalCost: booking.totalCost,
        energyConsumed: booking.energyConsumed,
      })),
      total: bookings.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lấy lịch sử booking" });
  }
};

// hủy booking (theo logic)
module.exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { userId } = req.body;
    const currentTime = new Date(); // Thời gian hiện tại

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify user owns the booking
    if (booking.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to cancel this booking" });
    }

    // Check if booking can be cancelled
    if (booking.status !== "pending" && booking.status !== "confirmed") {
      return res.status(400).json({
        message: "Booking cannot be cancelled in its current state",
      });
    }

    // Thêm logic mới: Không cho hủy nếu đã qua thời gian bắt đầu
    if (booking.startTime <= currentTime) {
      return res.status(400).json({
        message: "Cannot cancel booking after its start time",
      });
    }

    // cập nhật trạng thái booking
    booking.status = "cancelled";
    await booking.save();

    // giảm 1 usedSLot
    const station = await ChargingStation.findById(booking.stationId);
    if (station) {
      station.usedSlot = Math.max(0, station.usedSlot - 1);
      await station.save();
    }

    res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
