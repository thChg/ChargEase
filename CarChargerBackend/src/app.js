const express = require("express");
const connectDB = require("./config/config");
const routeAll = require("./routes/routeAll");
const methodOverride = require("method-override");

require("dotenv").config();
// chạy db online
connectDB();

const PORT = 8080;

const app = express();
app.use(methodOverride("_method"));
app.use(express.json());

// route tổng
routeAll(app);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
