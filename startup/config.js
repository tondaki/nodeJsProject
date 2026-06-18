const morgan = require("morgan");
const debug = require("debug")("app:main");
module.exports = function (express, app) {
  app.use(express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("tiny"));
};
