const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { IsLoggin } = require("../../middleware/auth");
const { cacheMiddleware } = require("../../middleware/cashing");
router.post("/create", IsLoggin, controller.createTask);
router.get(
  "/get",
  IsLoggin,
  cacheMiddleware({ ttlSeconds: 120 }),
  controller.getTask,
);
router.put("/update/:id", IsLoggin, controller.updateTask);
router.delete("/delete/:id", IsLoggin, controller.deleteTask);
module.exports = router;
