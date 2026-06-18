const winston = require("winston");
const debug = require("debug")("main:app");
module.exports = function () {
  process.on("uncaughtException", (ex) => {
    debug(ex);
    console.error(ex);
    winston.error(ex.message, ex);
  });
  process.on("unhandledRejection", (ex) => {
    debug(ex);
    console.error(ex);
    winston.error(ex.error, ex);
    process.exit(1);
  });
  winston.add(new winston.transports.File({ filename: "logs.log" }));
};
