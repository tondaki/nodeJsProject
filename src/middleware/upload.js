const muiter = require("multer");

const storage = muiter.diskStorage({
  destination(req, file, cb) {
    cb(null, "pubilc/uploads");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = muiter({
  storage,
});
