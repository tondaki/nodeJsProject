const { validationResult } = require("express-validator");
const autoBind = require("auto-bind");
const User = require("../model/user");
const Task = require("../model/task");
module.exports = class {
  constructor() {
    autoBind(this);
    this.User = User;
    this.Task = Task;
  }
  vaildate(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array();
      const message = [];
      errors.forEach((err) => {
        message.push(err);
      });
      return false;
    }
    return true;
  }
  vaildator(req, res, next) {
    if (!this.vaildate(req, res)) {
      return;
    }
    next();
  }
  response({ res, data = {}, code = 200, msg }) {
    res.status(code).json({
      msg,
      data,
    });
  }
};
