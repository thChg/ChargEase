const User = require("../models/users");

const getUserInfo = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    res.json({ username: user.username });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUserInfo };
