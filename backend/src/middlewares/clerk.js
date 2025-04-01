const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

const authMiddleware = ClerkExpressWithAuth();

module.exports = authMiddleware;
