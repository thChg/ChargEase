require("dotenv").config();
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

const authMiddleware = ClerkExpressRequireAuth({
  secretKey: process.env.CLERK_SECRET_KEY,
});

module.exports = authMiddleware;
