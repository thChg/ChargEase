const ChargingStation = require("../models/chargingStation");
const haversine = require("../utils/distance");
const smartcar = require("smartcar");
const Comment = require("../models/comment");

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

// tìm các trạm xạc theo sắp xếp khoảng cách tăng dần
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

        // Tính remainingSlots
        const remainingSlots = Math.max(0, station.slot - station.usedSlot);

        // Cập nhật status dựa trên remainingSlots
        const status = remainingSlots > 0 ? "available" : "unavailable";

        return {
          id: station._id,
          name: station.name,
          longitude: station.longitude,
          latitude: station.latitude,
          address: station.address,
          status: status, // Thay status bằng 'available' hoặc 'unavailable'
          distance: distance.toFixed(2),
          isFavourite: user ? user.favourites.includes(station._id) : false,
          reachable: distance <= maxRange,
        };
      })
      .sort((a, b) => a.distance - b.distance);

    res.json({
      stations: stationsWithDistance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// thông tin cơ bản của trạm xạc
module.exports.summaryinfo = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ message: "Trạm sạc không tồn tại" });
    }

    // Tính toán sao trung bình và số lượng đánh giá
    const comments = await Comment.find({ stationId: station._id });
    const totalStars = comments.reduce((sum, comment) => sum + comment.star, 0);
    const averageRating =
      comments.length > 0 ? (totalStars / comments.length).toFixed(1) : 0;

    res.json({
      name: station.name,
      address: station.address,
      introduce: station.introduce,
      amenities: station.amenities,
      rating: {
        average: parseFloat(averageRating),
        totalReviews: comments.length,
      },
      operatingHours: station.operatingHours,
      fee: station.fee,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.fullinfo = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ message: "Trạm sạc không tồn tại" });
    }

    const comments = await Comment.find({ stationId: station._id })
      .sort({ createdAt: -1 }) // Sắp xếp comment mới nhất trước
      .lean();

    // Tính toán rating
    const totalStars = comments.reduce((sum, comment) => sum + comment.star, 0);
    const averageRating =
      comments.length > 0 ? (totalStars / comments.length).toFixed(1) : 0;

    // Tạo response object
    const response = {
      ...station.toObject(),
      rating: {
        average: parseFloat(averageRating),
        totalReviews: comments.length,
        breakdown: [1, 2, 3, 4, 5].map((star) => ({
          star,
          count: comments.filter((c) => c.star === star).length,
        })),
      },
      comments: comments.map((comment) => ({
        ...comment,
        createdAt: new Date(comment.createdAt).toLocaleString(),
      })),
      availableSlots: station.slot - station.usedSlot, // Thêm thông tin slot còn trống
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
