const express = require("express");
const connectDB = require("./config/config");
const routeAll = require("./routes/routeAll");
const methodOverride = require("method-override");
const { logInfo } = require("./middlewares/winstonLogger");

require("dotenv").config();
require("./utils/bookingCron");
// chạy db online
connectDB();

const PORT = 8080;

const app = express();
app.use(methodOverride("_method"));
app.use(express.json());

// SMARTCAR_REDIRECT_URL=exp://192.168.1.14:8081/--/callback
app.use(logInfo);

// route tổng
routeAll(app);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
