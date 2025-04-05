const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  gmail: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  favourites: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "chargingstations",
  },
});

module.exports = mongoose.model("users", UserSchema, "users");
