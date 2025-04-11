// clerk set up secret-key
const { Clerk } = require("@clerk/clerk-sdk-node");

const clerkClient = new Clerk({
  secretKey: process.env.CLERK_SECRET_KEY, // Thêm secret key
});

module.exports = clerkClient;
