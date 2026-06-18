const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { IsLoggin } = require("../../middleware/auth");
const upload = require("../../middleware/upload");
router.post(
  "/avater",
  IsLoggin,
  upload.fields([
    {
      name: "avatar",
      maxcount: 1,
    },
  ]),
  controller.updload,
);
module.exports = router;
