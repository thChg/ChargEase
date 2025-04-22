const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  favourites: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "chargingstations",
  },
});

module.exports = mongoose.model("users", UserSchema, "users");
