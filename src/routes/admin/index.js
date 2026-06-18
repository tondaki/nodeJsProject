const express = require("express");
const router = express.Router();
const controller = require("../admin/controller");
const { IsLoggin, IsAdmin } = require("../../middleware/auth");
const User = require("../../model/user");
router.get("/users", IsLoggin, IsAdmin, controller.getUsers);
router.delete("/users/:id", IsLoggin, IsAdmin, controller.deleteUser);
module.exports = router;
