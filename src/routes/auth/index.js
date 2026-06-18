const express = require("express");
const router = express.Router();

const validator = require("./vaildtor");
const controller = require("./controller");
const passport = require("passport");

router.post(
  "/register",
  validator.regvaildtor(),
  controller.vaildator,
  controller.register,
);
/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register new User
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               name: "Ali"
 *               email: "ali123@email.com"
 *               password: "123456"
 *     responses:
 *       200:
 *         description: Register success
 */

router.post(
  "/login",
  validator.login(),
  controller.vaildate,
  controller.register,
);
router.post("/refreshToken", controller.refreshToken);
router.get("/verify/:token", controller.verifyEmail);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password/:token", controller.resetPassword);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  controller.googleCallback,
);
router.post("/verify-otp", controller.verifyOTP);
module.exports = router;
