const Booking = require("../models/booking");
const ChargingStation = require("../models/chargingStation");
const smartcar = require("smartcar");

// tao booking
module.exports.createBooking = async (req, res) => {
  try {
    const { userId, stationId, startTime, endTime, paymentMethod } = req.body;
    const accessToken = req.headers["smartcar-token"];

    // 1. Kiểm tra access token
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Thiếu access token của Smartcar" });
    }

    // 2. Lấy thông tin xe từ Smartcar API
    const vehicles = await smartcar.getVehicles(accessToken);
    if (!vehicles.vehicles?.length) {
      return res.status(404).json({ message: "Không tìm thấy xe" });
    }

    const vehicle = new smartcar.Vehicle(vehicles.vehicles[0], accessToken);
    const [battery, charge] = await Promise.all([
      vehicle.battery().catch(() => null),
      vehicle.charge().catch(() => null),
    ]);

    // 3. Validate dữ liệu pin xe
    if (!battery) {
      return res
        .status(400)
        .json({ message: "Không thể lấy thông tin pin xe" });
    }

    const batteryCapacity = 100; // Giả định dung lượng pin (có thể lấy từ vehicle.attributes() nếu có)
    const currentBatteryPercent = battery.percentRemaining * 100;

    // 4. Validate thời gian (UTC+7)
    const getVnTime = (date) => new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const currentVnTime = getVnTime(new Date());
    const startVnTime = getVnTime(new Date(startTime));
    const endVnTime = getVnTime(new Date(endTime));

    if (startVnTime.getTime() < currentVnTime.getTime()) {
      return res
        .status(400)
        .json({ message: "Thời gian bắt đầu không hợp lệ" });
    }

    // 5. Kiểm tra trạm sạc
    const station = await ChargingStation.findById(stationId);
    if (!station) {
      return res.status(404).json({ message: "Trạm sạc không tồn tại" });
    }

    // 6. Tính toán thời gian sạc
    const calculateChargingTime = () => {
      const remainingPercent = 100 - currentBatteryPercent;
      const energyNeeded = (remainingPercent / 100) * batteryCapacity;
      return energyNeeded / station.chargingPowerPerMinute; // phút
    };

    const chargingTimeMinutes = calculateChargingTime();
    const bookingDurationHours = (endVnTime - startVnTime) / (1000 * 60 * 60);

    if (bookingDurationHours < chargingTimeMinutes / 60) {
      return res.status(400).json({
        message: `Thời gian booking không đủ. Cần ${Math.ceil(
          chargingTimeMinutes / 60
        )} giờ để sạc đầy`,
      });
    }

    // 7. Kiểm tra slot trống (giữ nguyên logic cũ)
    const overlappingBookings = await Booking.find({
      stationId,
      status: { $in: ["confirmed", "pending"] },
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    });

    if (overlappingBookings.length >= station.slot) {
      return res.status(400).json({ message: "Trạm đã hết chỗ" });
    }

    // 8. Tạo booking
    const booking = new Booking({
      userId,
      stationId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      totalCost: station.baseFee * bookingDurationHours,
      paymentMethod,
      status: "confirmed",
      vehicleInfo: {
        // Lưu thêm thông tin xe
        vin: vehicles.vehicles[0],
        battery: {
          capacity: batteryCapacity,
          currentPercent: currentBatteryPercent,
        },
      },
    });

    await booking.save();

    // 9. Trả về response
    res.status(201).json({
      bookingId: booking._id,
      status: booking.status,
      totalCost: booking.totalCost,
      stationName: station.name,
      chargingInfo: {
        batteryCapacity,
        currentBatteryPercent,
        targetPercent: 100,
        requiredChargingTime: chargingTimeMinutes,
        chargingRate: `${station.chargingPowerPerMinute * 60} kWh/h`, // Hiển thị theo giờ
      },
      timeInfo: {
        startTime: startVnTime.toISOString(),
        endTime: endVnTime.toISOString(),
      },
    });
  } catch (error) {
    console.error("[Booking Error]", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
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
