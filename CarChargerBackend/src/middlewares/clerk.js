require("dotenv").config();
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

console.log("Clerk Secret Key:", process.env.CLERK_SECRET_KEY);

module.exports = ClerkExpressRequireAuth();
