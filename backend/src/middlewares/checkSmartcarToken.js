const axios = require("axios");

const checkSmartcarToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access token không có, vui lòng đăng nhập." });
    }

    // Sử dụng endpoint hợp lệ để kiểm tra token
    const response = await axios.get("https://auth.smartcar.com/v1/check", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Kiểm tra phản hồi thành công (Smartcar có thể trả về 200 hoặc 204)
    if (response.status >= 200 && response.status < 300) {
      // Lưu thông tin token vào request để sử dụng sau này nếu cần
      req.smartcarToken = token;
      return next();
    }

    return res.status(401).json({ message: "Access token không hợp lệ." });
  } catch (error) {
    console.error("Lỗi xác thực Smartcar:", error);

    if (error.response) {
      // Nếu Smartcar trả về lỗi cụ thể
      return res.status(error.response.status).json({
        message: error.response.data.message || "Xác thực Smartcar thất bại",
      });
    }

    return res.status(500).json({ message: "Lỗi server khi xác thực token" });
  }
};

module.exports = checkSmartcarToken;
