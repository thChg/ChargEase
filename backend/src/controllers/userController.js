const User = require("../models/users");
const clerk = require("../utils/clerk");
const ChargingStation = require("../models/chargingStation");

// thêm trạm xạc ưa thích
module.exports.addFavoriteCharger = async (req, res) => {
  try {
    const userID = req.body.userID;
    const chargerId = req.params.id;

    if (!userID) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Tìm user trong MongoDB bằng username
    const user = await User.findOne({ _id: userID });
    
    if (!user) {
      await User.create({
        _id: userID,
        favourites: [chargerId],
      });
      return res.status(201).json({
        message: "User created and charger added to favorites",
      });
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

// xóa trạm xạc ưa thích
module.exports.removeFavoriteCharger = async (req, res) => {
  try {
    const userID = req.body.userID;
    const chargerId = req.params.id;

    if (!userID) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Tìm user trong MongoDB bằng username
    const user = await User.findOne({ _id: userID });

    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    // Xóa charger khỏi favorites
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $pull: { favourites: chargerId } },
      { new: true }
    ).populate("favourites");

    if (!updatedUser) {
      return res.status(404).json({ message: "User update failed" });
    }

    res.status(200).json({
      message: "Charger removed from favorites successfully",
      favourites: updatedUser.favourites,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//thao tác cập nhật số lượng slot sử dụng
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
