const charger = require("./chargingRoute");
const user = require("./userRoute");
const smartcar = require("./smartCarRoute");

module.exports = (app) => {
  app.use("/charger", charger);
  app.use("/user", user);
  app.use("/smartcar", smartcar);
};
