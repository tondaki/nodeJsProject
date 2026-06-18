const { createClient } = require("redis");
const debug = require("debug")("main:app");
const client = createClient({
  url: "redis://127.0.0.1:6379",
});

client.on("error", (err) => {
  debug(err);
});

(async () => {
  await client.connect();
  debug("Reids Conncted");
})();

module.exports = client;
