const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const io = require("./startup/socket")(server);
app.set("io", io);
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
