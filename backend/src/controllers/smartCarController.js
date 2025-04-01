const smartcar = require("smartcar");
require("dotenv").config();

const authClient = new smartcar.AuthClient({
  clientId: process.env.SMARTCAR_CLIENT_ID,
  clientSecret: process.env.SMARTCAR_CLIENT_SECRET,
  redirectUri: process.env.SMARTCAR_REDIRECT_URL,
  mode: "simulated",
});

// Bộ nhớ tạm (giả sử, bạn có thể thay bằng DB)
const userTokens = {};

// 🔹 Bước 1: Tạo URL đăng nhập
exports.getAuthUrl = (req, res) => {
  const authUrl = authClient.getAuthUrl([
    "read_vehicle_info",
    "read_location",
    "read_odometer",
    "read_fuel",
    "read_battery",
    "read_charge",
  ]);
  res.json({ url: authUrl });
};

// 🔹 Bước 2: Xử lý callback, lưu token
exports.handleAuthCallback = async (req, res, next) => {
  try {
    if (req.query.error) {
      return next(new Error(req.query.error));
    }

    // Sử dụng authClient thay vì client
    const tokens = await authClient.exchangeCode(req.query.code);
    console.log(tokens)
    const vehicles = await smartcar.getVehicles(tokens.accessToken);
    console.log(vehicles)
    // instantiate first vehicle in vehicle list
    const vehicle = new smartcar.Vehicle(
      vehicles.vehicles[0],
      tokens.accessToken
    );
    // get identifying information about a vehicle
    const attributes = await vehicle.attributes();
    console.log(attributes);
    console.log("Authorization Code:", req.query.code);
    console.log("Access Token:", tokens.accessToken);

    res.json({
      message: "Authorization successful!",
      authorizationCode: req.query.code, // In ra mã authorization
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Bước 4: Lấy thông tin xe
exports.getVehicleInfo = async (req, res) => {
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

    // Lấy xe đầu tiên
    const vehicle = new smartcar.Vehicle(vehicles.vehicles[0], accessToken);

    // Lấy thông tin xe
    // const attributes = await vehicle.attributes();
    // console.log(attributes);

    const [attributes, location, battery, fuel, odometer] = await Promise.all([
      vehicle.attributes(),
      vehicle.location(),
      vehicle.battery().catch(() => null),
      vehicle.fuel().catch(() => null),
      vehicle.odometer().catch(() => null),
    ]);

    res.json({
      vin: attributes.vin,
      make: attributes.make,
      model: attributes.model,
      year: attributes.year,
      location,
      battery: battery ? battery.percentRemaining * 100 : null,
      range: battery ? battery.range : fuel ? fuel.range : null,
      fuel: fuel ? fuel.percentRemaining * 100 : null,
      odometer: odometer ? odometer.distance : null,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
