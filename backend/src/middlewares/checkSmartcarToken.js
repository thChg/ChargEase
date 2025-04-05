const axios = require("axios");

// Middleware kiểm tra Access Token của Smartcar
const checkSmartcarToken = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const token = req.headers["authorization"]?.split(" ")[1]; // lấy token sau "Bearer"

    // Kiểm tra nếu không có token
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access token không có, vui lòng đăng nhập." });
    }

    // Kiểm tra token bằng API của Smartcar (ví dụ với endpoint xác thực token)
    const response = await axios.post(
      "https://api.smartcar.com/v2.0/me",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Kiểm tra phản hồi từ Smartcar (nếu cần)
    if (response.status !== 200) {
      return res.status(401).json({ message: "Access token không hợp lệ." });
    }

    // Nếu token hợp lệ, cho phép yêu cầu tiếp tục
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ message: "Token không hợp lệ hoặc yêu cầu không thể xác thực." });
  }
};

module.exports = checkSmartcarToken;
