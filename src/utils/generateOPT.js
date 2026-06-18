const crypto = require("crypto");

module.exports = function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString();
};
