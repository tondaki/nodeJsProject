const Controller = require("../controller");
const redis = require("../../../startup/redis");
module.exports = new (class extends Controller {
  async createTask(req, res) {
    try {
      const { title, description } = req.body;
      const task = await this.Task.create({
        title,
        description,
        user: req.user._id,
      });
      const io = req.app.get("io");
      io.emit("new-task", task)(await task).save();
      await redis.del(`tasks:${req.user._id}`);
      return this.response({
        res,
        msg: "Task created successfully",
        data: task,
      });
    } catch (err) {
      return this.response({
        res,
        code: 500,
        msg: "Server Error",
      });
    }
  }
  async getTask(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      // Search
      const search = req.query.search || "";

      // Sort
      const sort = req.query.sort || "-createdAt";

      const tasks = await this.Task.find({
        user: req.user._id,
        title: {
          $regex: search,
          $options: "i",
        },
      })
        .populate("user", "email name")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);
      return this.response({
        res,
        msg: "Success",
        data: tasks,
      });
    } catch (err) {
      return this.response({
        res,
        code: 500,
        msg: "Server Error",
      });
    }
  }
  async updateTask(req, res) {
    try {
      const task = await this.Task.findById(req.params.id);
      if (!task) {
        return this.response({
          res,
          msg: "Task not found",
          code: 404,
        });
      }
      if (task.user.toString !== req.user._id) {
        return this.response({
          res,
          code: 403,
          msg: "Access denied",
        });
      }
      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.status = req.body.status || task.status;
      await task.save();
      await redis.del(`tasks:${req.user._id}`);
      return this.response({
        res,
        msg: "Task updated successfully",
        data: task,
      });
    } catch (err) {
      return this.response({
        res,
        code: 500,
        msg: "Server Error",
      });
    }
  }

  async deleteTask(req, res) {
    try {
      const task = await this.Task.findById(req.user._id);
      if (!task) {
        return this.response({
          res,
          msg: "Access denied",
          code: 403,
        });
      }
      if (task.user.toString !== req.user._id) {
        return this.response({
          res,
          code: 403,
          msg: "Access denied",
        });
      }

      task.deleted = true;
      await task.save();
      await redis.del(`tasks:${req.user._id}`);
      return this.response({
        res,
        msg: "Task deleted successfully",
      });
    } catch (err) {
      return this.response({
        res,
        code: 500,
        msg: "Server Error",
      });
    }
  }
})();
