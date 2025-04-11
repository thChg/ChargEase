const Booking = require("../models/booking");
const ChargingStation = require("../models/chargingStation");

// tao booking
module.exports.createBooking = async (req, res) => {
  try {
    const { userId, stationId, startTime, endTime, paymentMethod } = req.body;
    const currentTime = new Date(); // Thời gian hiện tại

    // 0. Kiểm tra thời gian hợp lệ (NEW LOGIC)
    if (new Date(startTime) < currentTime) {
      return res.status(400).json({
        message: "Thời gian bắt đầu không được trong quá khứ",
      });
    }

    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({
        message: "Thời gian kết thúc phải sau thời gian bắt đầu",
      });
    }

    // 1. Kiểm tra trạm có tồn tại và còn slot không
    const station = await ChargingStation.findById(stationId);
    if (!station) {
      return res.status(404).json({ message: "Trạm sạc không tồn tại" });
    }

    // 2. Check overlapping bookings
    const overlappingBookings = await Booking.find({
      stationId,
      status: { $in: ["confirmed", "pending"] },
      $or: [
        {
          startTime: { $lt: new Date(endTime) },
          endTime: { $gt: new Date(startTime) },
        },
      ],
    });

    if (overlappingBookings.length >= station.slot) {
      return res
        .status(400)
        .json({ message: "Trạm đã hết slot trong khoảng thời gian này" });
    }

    // 3. Tính toán giá (ví dụ: 10.000 VND/phút)
    const durationHours =
      (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
    const totalCost = station.fee * durationHours;

    // 4. Tạo booking
    const booking = new Booking({
      userId,
      stationId,
      startTime,
      endTime,
      totalCost,
      paymentMethod,
      status: "confirmed",
    });

    await booking.save();

    // 5. Cập nhật usedSlot của trạm
    station.usedSlot += 1;
    await station.save();

    res.status(201).json({
      bookingId: booking._id,
      status: booking.status,
      totalCost: booking.totalCost,
      stationName: station.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi tạo booking" });
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
