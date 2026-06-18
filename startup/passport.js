const passport = require("passport");
require("../src/passport/google")(passport);

module.exports = passport;
