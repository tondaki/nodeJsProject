const Controller = require("./../controller");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const redis = require("../../../startup/redis");
const generateOTP = require("../../utils/generateOPT");
module.exports = new (class extends Controller {
  async register(req, res) {
    try {
      let user = await this.User.findOne({ email: req.body.email });
      if (user) {
        return this.response({
          res,
          code: 400,
          msg: "user already exist",
        });
      }
      const { name, email, password } = req.body;
      const salt = bcrypt.genSalt(10);
      const hashedpasword = bcrypt.hash(user.password, salt);
      user = this.User.create({
        name: name,
        email: email,
        password: hashedpasword,
      });
      const verifyedToken = jwt.sign(
        { _id: user._id },
        config.get("verify_key"),
        { expiresIn: "15h" },
      );
      await user.save();
      return this.response({
        res,
        msg: "register succes",
        data: user.id,
      });
    } catch (error) {
      return this.response({
        res,
        code: 500,
        msg: "server error",
      });
    }
  }
  async login(req, res) {
    let user = await this.User.findOne({ email: req.body.email });
    if (!user) {
      return this.response({
        res,
        msg: "user is not found",
        code: 400,
      });
    }
    const isVaild = await bcrypt.compare(req.body.password, user.password);
    if (!isVaild) {
      return this.response({
        res,
        msg: "user is not found",
        code: 400,
      });
    }
    if (!user.verified) {
      return this.response({
        res,
        code: 403,
        msg: "user is not found",
      });
    }
    if (user.twoFcatorEnabled) {
      const opt = generateOTP();
      await redis.set(`otp:${user._id}`, opt, { EX: 120 });
      return this.response({
        res,
        msg: "OTP Sent",
        data: {
          userId: user._id,
        },
      });
    }

    const accessToken = jwt.sign({ _id: user.id }, config.get("jwt_key"), {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { _id: user._id },
      config.get("refresh_key"),
      { expiresIn: "7d" },
    );
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    // user.refreshToken = refreshToken;
    user.refreshToken = hashedRefreshToken;
    await user.save();
    return this.response({
      res,
      msg: "login is success",
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  }
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return this.response({
          res,
          code: 401,
          msg: "Refresh Token Required",
        });
      }
      const payload = jwt.verify(refreshToken, config.get("refresh_key"));
      const user = await this.User.findById(payload._id);
      if (!user) {
        return this.response({
          res,
          code: 401,
          msg: "User not found",
        });
      }
      const isVaild = bcrypt.compare(refreshToken, user.refreshToken);
      if (!isVaild) {
        return this.response({ res, code: 401, msg: "Invalid Refresh Token" });
      }
      const accessToken = jwt.sign({ _id: user._id }, config.get("jwt_key"), {
        expiresIn: "15m",
      });
      return this.response({
        res,
        msg: "success",
        data: {
          accessToken,
        },
      });
    } catch (error) {
      return this.response({
        res,
        code: 401,
        msg: "Invalid Refresh Token",
      });
    }
  }
  async verifyEmail(req, res) {
    const payload = jwt.verify(req.params.token, config.get("verify_key"));
    const user = await this.User.findById(payload._id);
    user.verified = true;
    await user.save();
    res.send("Email Verified");
  }
  async forgotPassword(req, res) {
    const user = await this.User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return this.response({
        res,
        code: 403,
        msg: "User not found",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        type: "reset-password",
      },
      config.get("reset_key"),
      {
        expiresIn: "15m",
      },
    );
    // ارسال ایمیل
    // localhost:8000/api/auth/reset-password/${token}
    return this.response({
      res,
      msg: "Reset link sent",
      data: {
        token,
      },
    });
  }
  async resetPassword(req, res) {
    try {
      const payload = jwt.verify(req.params.token, config.get("reset_key"));
      if (payload.type !== "reset-password") {
        return this.response({
          res,
          code: 400,
          msg: "Invalid token type",
        });
      }
      const user = await this.User.findById(payload._id);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
      await user.save();

      return this.response({
        res,
        msg: "Password changed successfully",
      });
    } catch (ex) {
      this.response({
        res,
        code: 400,
        msg: "User not found",
      });
    }
  }
  async googleCallback(req, res) {
    const token = jwt.sign({ _id: req.user._id }, config.get("jwt_key"), {
      expiresIn: "15m",
    });
    return this.response({
      res,
      msg: "Login Success",
      data: {
        token,
      },
    });
  }
  async verifyOTP(req, res) {
    const { userId, opt } = req.body;
    const savedOpt = await redis.get(`opt:${userId}`);
    if (savedOpt !== opt) {
      return this.response({
        res,
        code: 400,
        msg: "Invaild OPT",
      });
    }
    await redis.del(`opt:${userId}`);
    const token = jwt.sign({ _id: userId }, config.get("jwt_key"), {
      expiresIn: "15m",
    });
    return this.response({
      res,
      msg: "Login Success",
      data: {
        token,
      },
    });
  }
})();
