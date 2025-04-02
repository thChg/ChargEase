const ChargingStation = require("../models/chargingStation");
const haversine = require("../utils/distance");
const smartcar = require("smartcar");

// Hàm lấy vị trí hiện tại (dùng request hoặc fallback về xe)
const getCurrentLocation = async (req, vehicle) => {
  if (req.query.latitude && req.query.longitude) {
    return {
      latitude: parseFloat(req.query.latitude),
      longitude: parseFloat(req.query.longitude),
    };
  }

  // Nếu không có vị trí truyền vào, lấy từ xe
  try {
    return await vehicle.location();
  } catch (error) {
    console.error("Lỗi khi lấy vị trí xe:", error);
    throw new Error("Không thể xác định vị trí");
  }
};

module.exports.getChargingStations = async (req, res) => {
  try {
    let accessToken = req.query.token || req.headers.authorization;

    if (accessToken && accessToken.startsWith("Bearer ")) {
      accessToken = accessToken.split(" ")[1];
    }

    if (!accessToken) {
      return res.status(401).json({ message: "Missing access token" });
    }

    // Lấy danh sách xe
    const vehicles = await smartcar.getVehicles(accessToken);
    if (!vehicles.vehicles?.length) {
      return res.status(404).json({ message: "No vehicles found" });
    }

    // Lấy thông tin xe từ xe đầu tiên
    const vehicle = new smartcar.Vehicle(vehicles.vehicles[0], accessToken);
    const [attributes, battery, fuel] = await Promise.all([
      vehicle.attributes(),
      vehicle.battery().catch(() => null),
      vehicle.fuel().catch(() => null),
    ]);

    // Lấy vị trí hiện tại từ người dùng hoặc từ xe
    const location = await getCurrentLocation(req, vehicle);
    const { latitude, longitude } = location;

    const maxRange = battery ? battery.range : fuel ? fuel.range : null;

    if (!maxRange) {
      return res
        .status(400)
        .json({ message: "Cannot determine vehicle range" });
    }

    // Lấy danh sách trạm sạc từ DB
    const stations = await ChargingStation.find();
    const user = req.user;

    // Lọc các trạm sạc trong phạm vi di chuyển
    const stationsWithDistance = stations
      .map((station) => {
        const distance = haversine(
          latitude,
          longitude,
          station.latitude,
          station.longitude
        );
        return {
          id: station._id,
          name: station.name,
          longitude: station.longitude,
          latitude: station.latitude,
          address: station.address,
          status: station.status,
          slot: station.slot, // Tổng khe sạc
          usedSlot: station.usedSlot, // Đã sử dụng
          remainingSlots: Math.max(0, station.slot - station.usedSlot), // Còn trống
          distance: distance.toFixed(2),
          isFavourite: user ? user.favourites.includes(station._id) : false,
          reachable: distance <= maxRange,
        };
      })
      .sort((a, b) => a.distance - b.distance);

    res.json({
      location,
      stations: stationsWithDistance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
