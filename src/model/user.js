const mongo = require("mongoose");
const userSchema = new mongo.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
      default: null,
    },
    verifed: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    twoFcatorEnabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const User = mongo.model("User", userSchema);

module.exports = User;
