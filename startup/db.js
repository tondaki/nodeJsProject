const mongo = require("mongoose");
const debug = require("debug")("app:main");
module.exports = async function () {
  try {
    await mongo.connect(process.env.MONGO_URL);
    debug("MongoDB Connected");
  } catch (err) {
    debug("MongoDB Not Connected");
  }
};
