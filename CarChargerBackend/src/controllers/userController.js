const User = require("../models/users");
const clerk = require("@clerk/clerk-sdk-node");

module.exports.getUserInfo = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId; // Lấy Clerk ID từ middleware
    if (!clerkUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Lấy thông tin user từ Clerk
    const clerkUser = await clerk.users.getUser(clerkUserId);
    const username = clerkUser.username; // Lấy username
    if (!username) {
      return res.status(404).json({ message: "Username not found in Clerk" });
    }
    // Tìm user trong MongoDB bằng username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }
    // Trả về toàn bộ thông tin của user trong DB
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports.addFavoriteCharger = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId; // Lấy Clerk ID từ middleware
    const chargerId = req.params.id;

    if (!clerkUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Lấy thông tin user từ Clerk
    const clerkUser = await clerk.users.getUser(clerkUserId);
    const username = clerkUser.username; // Lấy username

    if (!username) {
      return res.status(404).json({ message: "Username not found in Clerk" });
    }

    // Tìm user trong MongoDB bằng username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    // Thêm charger vào favorites
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { favourites: chargerId } },
      { new: true }
    ).populate("favourites");

    res.status(200).json({
      message: "Charger added to favorites successfully",
      favourites: updatedUser.favourites,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports.updateUsedSlot = async (req, res) => {
  try {
    const { change } = req.body; // `change = +1` hoặc `change = -1`
    if (![1, -1].includes(change)) {
      return res.status(400).json({ message: "Invalid change value" });
    }

    const station = await ChargingStation.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ message: "Charging station not found" });
    }

    // Tăng giảm usedSlot nhưng không vượt quá slot
    let newUsedSlot = station.usedSlot + change;
    if (newUsedSlot < 0 || newUsedSlot > station.slot) {
      return res.status(400).json({ message: "Invalid slot update" });
    }

    station.usedSlot = newUsedSlot;
    await station.save();

    res.json({
      message: "Used slot updated",
      slot: station.slot,
      usedSlot: station.usedSlot,
      remainingSlots: Math.max(0, station.slot - station.usedSlot),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
