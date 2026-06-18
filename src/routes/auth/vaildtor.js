const { check } = require("express-validator");

module.exports = new (class {
  regvaildtor() {
    return [
      check("name")
        .notEmpty()
        .withMessage("name is required")
        .trim()
        .isLength({ min: 3, max: 30 }),
      check("email")
        .isEmail()
        .withMessage("email is invaild")
        .trim()
        .normalizeEmail(),
      check("password").isStrongPassword({
        minLength: 8,
        minUppercase: 1,
        minNumbers: 1,
      }),
    ];
  }
  login() {
    return [check("email").isEmail(), check("password").notEmpty()];
  }
})();
