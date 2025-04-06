const charger = require("./chargingRoute");
const user = require("./userRoute");
const smartcar = require("./smartCarRoute");
const comment = require("./comment");

module.exports = (app) => {
  app.use("/charger", charger);
  app.use("/user", user);
  app.use("/smartcar", smartcar);
  app.use("/comment", comment);
};
