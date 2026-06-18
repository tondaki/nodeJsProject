const express = require("express");
const app = express();

require("dotenv").config();

require("./startup/db")();
require("./startup/security")(app);
require("./startup/config")(express, app);
require("./startup/logging")();
require("./startup/redis")();

const passport = require("./startup/passport");
const session = require("express-session");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

const router = require("./src/routes");
app.use("/api", router);

module.exports = app;
